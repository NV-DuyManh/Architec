import re
import pathlib
import base64
import time
import os

from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False


def detect_product_from_image(image_path):
    """
    Gửi ảnh lên Groq Vision (llama-4-scout), trả về keyword sản phẩm.
    Free, không bị block ở Việt Nam.
    """
    # Re-read key from env mỗi lần gọi (phòng trường hợp .env thay đổi)
    api_key = os.environ.get('GROQ_API_KEY', '') or GROQ_API_KEY

    if not GROQ_AVAILABLE:
        print("[AI] Chưa cài groq. Chạy: pip install groq")
        return None

    if not api_key:
        print("[AI] Chưa set GROQ_API_KEY trong file .env")
        return None

    print(f"[AI] Bắt đầu nhận diện ảnh: {image_path}")

    # Kiểm tra file tồn tại
    if not os.path.exists(image_path):
        print(f"[AI] File ảnh không tồn tại: {image_path}")
        return None

    # Đọc và encode ảnh base64
    ext = str(image_path).rsplit('.', 1)[-1].lower()
    mime_map = {
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'png': 'image/png',  'webp': 'image/webp',
        'gif': 'image/gif'
    }
    mime_type = mime_map.get(ext, 'image/jpeg')

    try:
        image_bytes = pathlib.Path(image_path).read_bytes()
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        print(f"[AI] Đã encode ảnh: {len(image_bytes)} bytes")
    except Exception as e:
        print(f"[AI] Lỗi đọc file ảnh: {e}")
        return None

    prompt = (
        "Look at this product image carefully. "
        "Identify the product brand and model. "
        "Return ONLY a short search keyword (2-5 words, lowercase, no punctuation). "
        "Examples: 'iphone 15 pro', 'samsung galaxy s24', 'macbook air m3'. "
        "Return ONLY the keyword. Nothing else."
    )

    # Thử tối đa 3 lần, tăng thời gian chờ giữa các lần
    for attempt in range(3):
        try:
            client = Groq(api_key=api_key)
            print(f"[AI] Gửi request lần {attempt + 1}/3...")
            response = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type":      "image_url",
                                "image_url": {"url": f"data:{mime_type};base64,{image_b64}"}
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }
                ],
                max_tokens=50
            )

            keyword = response.choices[0].message.content.strip().lower()
            keyword = re.sub(r'["\'\.\n\r]', '', keyword).strip()
            keyword = re.sub(r'\s+', ' ', keyword)

            if keyword and len(keyword) >= 2:
                print(f"[AI] ✅ Nhận diện thành công: '{keyword}'")
                return keyword

            print(f"[AI] Keyword trống hoặc quá ngắn: '{keyword}'")
            return None

        except Exception as e:
            error_msg = str(e)
            print(f"[AI] Lần {attempt + 1}/3 lỗi: {type(e).__name__}: {error_msg}")

            # Nếu là rate limit (429), chờ lâu hơn
            if '429' in error_msg or 'rate' in error_msg.lower():
                wait_time = (attempt + 1) * 5  # 5s, 10s, 15s
                print(f"[AI] Rate limit! Chờ {wait_time}s...")
                time.sleep(wait_time)
            elif attempt < 2:
                time.sleep(2)

    print("[AI] ❌ Thất bại sau 3 lần thử.")
    return None
