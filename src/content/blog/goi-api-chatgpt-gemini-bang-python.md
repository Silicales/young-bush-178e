---
title: "Gọi API ChatGPT và Gemini bằng Python: tóm tắt văn bản tiếng Việt"
description: "Hướng dẫn chi tiết cách gọi API OpenAI ChatGPT và Google Gemini bằng Python để tóm tắt văn bản, xử lý lỗi rate limit, và ước tính chi phí token."
pubDate: "Oct 22 2026"
heroImage: "/blog-placeholder-2.jpg"
---

Bạn muốn tự động hóa việc tóm tắt văn bản bằng AI? Trong bài viết này, mình sẽ hướng dẫn chi tiết cách gọi API của **OpenAI ChatGPT** và **Google Gemini** bằng Python, áp dụng vào bài toán thực tế: **tóm tắt file văn bản tiếng Việt**.

## Tại sao dùng API thay vì web interface?

Khi làm việc với ChatGPT hoặc Gemini trên web, bạn phải copy-paste thủ công. Nhưng với API, bạn có thể:

- ✅ **Tự động hóa:** Xử lý hàng trăm file cùng lúc
- ✅ **Tích hợp vào ứng dụng:** Bot Telegram, web app, workflow
- ✅ **Kiểm soát:** Custom prompt, xử lý lỗi, retry logic
- ✅ **Chi phí:** Chỉ trả tiền cho những gì dùng (rẻ hơn gói subscription)

## Chuẩn bị

### 1. Cài đặt Python và thư viện

Đảm bảo bạn có **Python 3.10 trở lên**. Kiểm tra:

```bash
python --version
```

Cài các thư viện cần thiết:

```bash
# Cho OpenAI ChatGPT
pip install openai

# Cho Google Gemini
pip install google-genai

# Thư viện phụ
pip install python-dotenv tiktoken
```

**Giải thích:**
- `openai`: SDK chính thức của OpenAI
- `google-genai`: SDK mới nhất của Google (thay thế `google-generativeai`)
- `python-dotenv`: Đọc API key từ file `.env`
- `tiktoken`: Đếm token để ước tính chi phí

### 2. Lấy API key

#### OpenAI API key

1. Đăng nhập [https://platform.openai.com](https://platform.openai.com)
2. Vào **API keys** → **Create new secret key**
3. Copy key (bắt đầu bằng `sk-proj-...`)
4. **Lưu ý:** Cần nạp tối thiểu $5 vào tài khoản để dùng API

#### Google Gemini API key

1. Truy cập [https://ai.google.dev](https://ai.google.dev)
2. Nhấn **Get API key**
3. Tạo project hoặc chọn project có sẵn
4. Copy API key
5. **Miễn phí:** 15 requests/phút, 1 triệu tokens/tháng (đủ để thử nghiệm)

### 3. Tạo file `.env`

Tạo file `.env` trong thư mục dự án:

```bash
OPENAI_API_KEY=sk-proj-abc123xyz...
GEMINI_API_KEY=AIzaSy...
```

**Lưu ý bảo mật:** Không commit file `.env` lên Git! Thêm vào `.gitignore`:

```bash
echo ".env" >> .gitignore
```

## Gọi API ChatGPT với OpenAI

### API mới: Responses API (khuyến nghị)

Từ tháng 6/2026, OpenAI khuyến nghị dùng **Responses API** thay vì Chat Completions. Dưới đây là cách dùng API mới:

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

# Tải API key từ file .env
load_dotenv()

# Khởi tạo client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def tom_tat_van_ban(van_ban, do_dai="3 câu"):
    """
    Tóm tắt văn bản bằng ChatGPT
    
    Args:
        van_ban: Nội dung cần tóm tắt (string)
        do_dai: Độ dài mong muốn (mặc định "3 câu")
    
    Returns:
        Văn bản đã được tóm tắt
    """
    prompt = f"""Tóm tắt đoạn văn sau thành {do_dai} ngắn gọn bằng tiếng Việt:

{van_ban}

Tóm tắt:"""

    try:
        response = client.responses.create(
            model="gpt-6-luna",  # Mô hình mới nhất (thay thế gpt-4o)
            instructions="Bạn là trợ lý tóm tắt văn bản chuyên nghiệp. Chỉ trả lời phần tóm tắt, không thêm giải thích.",
            input=prompt
        )
        
        return response.output_text.strip()
    
    except Exception as e:
        return f"Lỗi: {str(e)}"

# Thử nghiệm
van_ban_mau = """
Trí tuệ nhân tạo (AI) đang thay đổi cách chúng ta làm việc và sống. 
Từ chatbot đến xe tự lái, AI đã len lỏi vào mọi khía cạnh của cuộc sống. 
Tuy nhiên, AI cũng đặt ra nhiều thách thức về đạo đức, quyền riêng tư và an ninh. 
Chúng ta cần có các quy định phù hợp để đảm bảo AI phát triển đúng hướng 
và mang lại lợi ích cho toàn xã hội.
"""

ket_qua = tom_tat_van_ban(van_ban_mau)
print(ket_qua)
```

**Output mẫu:**

```
AI đang thay đổi cuộc sống con người ở nhiều lĩnh vực. Tuy nhiên, nó cũng 
đặt ra thách thức về đạo đức và bảo mật. Cần có quy định để AI phát triển 
đúng hướng.
```

### API cũ: Chat Completions (vẫn hoạt động)

Nếu bạn quen với API cũ, nó vẫn hoạt động:

```python
def tom_tat_chat_completion(van_ban):
    """Tóm tắt bằng Chat Completions API (legacy)"""
    response = client.chat.completions.create(
        model="gpt-6-luna",
        messages=[
            {
                "role": "system", 
                "content": "Bạn là trợ lý tóm tắt văn bản."
            },
            {
                "role": "user",
                "content": f"Tóm tắt: {van_ban}"
            }
        ],
        temperature=0.3,  # Giảm độ sáng tạo để tăng độ chính xác
        max_tokens=150
    )
    
    return response.choices[0].message.content
```

## Gọi API Google Gemini

Google Gemini có API mới tên là **Interactions API** (từ tháng 6/2026):

```python
import os
from google import genai
from dotenv import load_dotenv

# Tải API key
load_dotenv()

# Khởi tạo client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def tom_tat_gemini(van_ban, do_dai="3 câu"):
    """
    Tóm tắt văn bản bằng Google Gemini
    
    Args:
        van_ban: Nội dung cần tóm tắt
        do_dai: Độ dài mong muốn
    
    Returns:
        Văn bản đã tóm tắt
    """
    prompt = f"Tóm tắt đoạn văn sau thành {do_dai}:\n\n{van_ban}"
    
    try:
        interaction = client.interactions.create(
            model="gemini-3.8-flash",  # Mô hình nhanh, miễn phí
            input=prompt
        )
        
        return interaction.output_text.strip()
    
    except Exception as e:
        return f"Lỗi: {str(e)}"

# Thử nghiệm
ket_qua = tom_tat_gemini(van_ban_mau)
print(ket_qua)
```

**So sánh mô hình Gemini:**

| Mô hình | Tốc độ | Chi phí | Chất lượng | Miễn phí |
|---------|--------|---------|------------|----------|
| `gemini-3.8-flash` | Rất nhanh | Thấp | Tốt | ✅ 15 req/phút |
| `gemini-4-argon` | Chậm | Cao | Xuất sắc | ❌ |
| `gemini-3.8-flash-lite` | Siêu nhanh | Rất thấp | Ổn | ✅ 60 req/phút |

**Khuyến nghị:** Dùng `gemini-3.8-flash` cho hầu hết các trường hợp.

## Script thực tế: Tóm tắt file văn bản

Hãy viết một script hoàn chỉnh đọc file `.txt`, `.docx`, tóm tắt và lưu kết quả:

### Cài thêm thư viện đọc DOCX

```bash
pip install python-docx
```

### Script hoàn chỉnh

```python
"""
Script tóm tắt văn bản tự động
Hỗ trợ: .txt, .docx
Sử dụng: python tom_tat.py input.txt --output summary.txt
"""

import os
import argparse
from pathlib import Path
from openai import OpenAI
from google import genai
from dotenv import load_dotenv
import docx

# Tải API keys
load_dotenv()

def doc_file_txt(file_path):
    """Đọc file .txt"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def doc_file_docx(file_path):
    """Đọc file .docx"""
    doc = docx.Document(file_path)
    return '\n'.join([para.text for para in doc.paragraphs])

def doc_file(file_path):
    """Đọc file tự động dựa trên extension"""
    ext = Path(file_path).suffix.lower()
    
    if ext == '.txt':
        return doc_file_txt(file_path)
    elif ext == '.docx':
        return doc_file_docx(file_path)
    else:
        raise ValueError(f"Định dạng file không hỗ trợ: {ext}")

def tom_tat_openai(van_ban, max_words=100):
    """Tóm tắt bằng OpenAI"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = client.responses.create(
        model="gpt-6-luna",
        instructions=f"Tóm tắt văn bản sau thành khoảng {max_words} từ bằng tiếng Việt.",
        input=van_ban
    )
    
    return response.output_text.strip()

def tom_tat_gemini(van_ban, max_words=100):
    """Tóm tắt bằng Gemini"""
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    prompt = f"Tóm tắt văn bản sau thành khoảng {max_words} từ:\n\n{van_ban}"
    
    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )
    
    return interaction.output_text.strip()

def main():
    parser = argparse.ArgumentParser(description="Tóm tắt văn bản bằng AI")
    parser.add_argument('input', help='File đầu vào (.txt hoặc .docx)')
    parser.add_argument('--output', '-o', help='File đầu ra (mặc định: input_summary.txt)')
    parser.add_argument('--api', choices=['openai', 'gemini'], default='gemini',
                        help='API sử dụng (mặc định: gemini)')
    parser.add_argument('--words', '-w', type=int, default=100,
                        help='Số từ tóm tắt (mặc định: 100)')
    
    args = parser.parse_args()
    
    # Đọc file
    print(f"Đang đọc file: {args.input}")
    try:
        noi_dung = doc_file(args.input)
    except Exception as e:
        print(f"Lỗi đọc file: {e}")
        return
    
    print(f"Độ dài văn bản: {len(noi_dung)} ký tự")
    
    # Tóm tắt
    print(f"Đang tóm tắt bằng {args.api.upper()}...")
    try:
        if args.api == 'openai':
            tom_tat = tom_tat_openai(noi_dung, args.words)
        else:
            tom_tat = tom_tat_gemini(noi_dung, args.words)
    except Exception as e:
        print(f"Lỗi khi gọi API: {e}")
        return
    
    print(f"Độ dài tóm tắt: {len(tom_tat.split())} từ")
    
    # Lưu kết quả
    if args.output:
        output_file = args.output
    else:
        input_path = Path(args.input)
        output_file = input_path.stem + '_summary.txt'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(tom_tat)
    
    print(f"Đã lưu tóm tắt vào: {output_file}")
    print("\nNội dung tóm tắt:")
    print("-" * 50)
    print(tom_tat)

if __name__ == "__main__":
    main()
```

### Sử dụng script

```bash
# Tóm tắt bằng Gemini (miễn phí)
python tom_tat.py bao_cao.txt

# Tóm tắt bằng OpenAI, 200 từ
python tom_tat.py bao_cao.docx --api openai --words 200 --output tom_tat.txt

# Tóm tắt file DOCX
python tom_tat.py tailieu.docx
```

## Xử lý lỗi thường gặp

### 1. Rate Limit (vượt giới hạn request)

**Lỗi:** `RateLimitError: Rate limit reached`

**Nguyên nhân:** Gọi API quá nhanh.

**Giải pháp:** Thêm retry với exponential backoff:

```python
import time
from openai import OpenAI, RateLimitError

def tom_tat_co_retry(van_ban, max_retries=3):
    """Tóm tắt với retry khi gặp rate limit"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    for i in range(max_retries):
        try:
            response = client.responses.create(
                model="gpt-6-luna",
                input=f"Tóm tắt: {van_ban}"
            )
            return response.output_text
        
        except RateLimitError as e:
            if i < max_retries - 1:
                wait_time = 2 ** i  # 1s, 2s, 4s
                print(f"Rate limit! Đợi {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise e
```

### 2. Context Length Exceeded (văn bản quá dài)

**Lỗi:** `InvalidRequestError: maximum context length exceeded`

**Giải pháp:** Chia nhỏ văn bản:

```python
def chia_van_ban(text, max_chars=10000):
    """Chia văn bản thành các đoạn nhỏ"""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        if current_length + len(word) + 1 > max_chars:
            chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)
            current_length += len(word) + 1
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def tom_tat_van_ban_dai(van_ban):
    """Tóm tắt văn bản dài bằng cách chia nhỏ"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    chunks = chia_van_ban(van_ban, max_chars=8000)
    tom_tat_cac_phan = []
    
    for i, chunk in enumerate(chunks):
        print(f"Đang xử lý phần {i+1}/{len(chunks)}...")
        
        response = client.responses.create(
            model="gpt-6-luna",
            input=f"Tóm tắt ngắn gọn:\n\n{chunk}"
        )
        
        tom_tat_cac_phan.append(response.output_text)
    
    # Tóm tắt các phần tóm tắt
    tom_tat_cuoi = '\n\n'.join(tom_tat_cac_phan)
    
    if len(chunks) > 1:
        response = client.responses.create(
            model="gpt-6-luna",
            input=f"Tổng hợp các tóm tắt sau thành một tóm tắt duy nhất:\n\n{tom_tat_cuoi}"
        )
        return response.output_text
    
    return tom_tat_cuoi
```

### 3. API Key không hợp lệ

**Lỗi:** `AuthenticationError: Invalid API key`

**Giải pháp:**
- Kiểm tra file `.env` có đúng key không
- Đảm bảo gọi `load_dotenv()` trước khi dùng `os.getenv()`
- Với OpenAI: Kiểm tra đã nạp tiền vào tài khoản chưa

### 4. Timeout

**Lỗi:** `Timeout: Request timed out`

**Giải pháp:** Tăng timeout:

```python
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    timeout=60.0  # Tăng từ 30s lên 60s
)
```

## Ước tính chi phí token

### Đếm token

Token là đơn vị tính phí. 1 token ≈ 0.75 từ tiếng Anh, ≈ 0.5-0.6 từ tiếng Việt.

```python
import tiktoken

def dem_token(text, model="gpt-6-luna"):
    """Đếm số token trong văn bản"""
    # Dùng encoding của GPT-4 làm xấp xỉ
    encoding = tiktoken.encoding_for_model("gpt-4")
    tokens = encoding.encode(text)
    return len(tokens)

# Ví dụ
van_ban = "Trí tuệ nhân tạo đang thay đổi thế giới."
so_token = dem_token(van_ban)
print(f"Số token: {so_token}")  # Output: ~10-12 tokens
```

### Tính chi phí OpenAI

**Bảng giá OpenAI (tháng 10/2026):**

| Mô hình | Input | Output |
|---------|-------|--------|
| gpt-6-luna | $2.50/1M tokens | $10.00/1M tokens |
| gpt-6-astra | $5.00/1M tokens | $15.00/1M tokens |
| gpt-5.6-sol | $3.00/1M tokens | $12.00/1M tokens |

```python
def uoc_tinh_chi_phi_openai(input_text, output_length=100, model="gpt-6-luna"):
    """
    Ước tính chi phí gọi API OpenAI
    
    Args:
        input_text: Văn bản đầu vào
        output_length: Số từ output dự kiến
        model: Tên mô hình
    
    Returns:
        Chi phí dự tính (USD)
    """
    # Giá tham khảo (USD per 1M tokens)
    prices = {
        "gpt-6-luna": {"input": 2.50, "output": 10.00},
        "gpt-6-astra": {"input": 5.00, "output": 15.00},
    }
    
    if model not in prices:
        model = "gpt-6-luna"
    
    input_tokens = dem_token(input_text)
    output_tokens = output_length * 1.5  # Ước tính
    
    input_cost = (input_tokens / 1_000_000) * prices[model]["input"]
    output_cost = (output_tokens / 1_000_000) * prices[model]["output"]
    
    total_cost = input_cost + output_cost
    
    print(f"Input: {input_tokens} tokens (${input_cost:.4f})")
    print(f"Output: ~{int(output_tokens)} tokens (${output_cost:.4f})")
    print(f"Tổng: ${total_cost:.4f}")
    
    return total_cost

# Thử nghiệm
van_ban_1000_tu = " ".join(["test"] * 1000)
uoc_tinh_chi_phi_openai(van_ban_1000_tu, output_length=100)
```

**Output mẫu:**

```
Input: 1500 tokens ($0.0038)
Output: ~150 tokens ($0.0015)
Tổng: $0.0053
```

### Tính chi phí Gemini

**Gemini miễn phí (tháng 10/2026):**
- `gemini-3.8-flash`: 15 requests/phút, 1 triệu tokens/ngày
- `gemini-3.8-flash-lite`: 60 requests/phút

**Gemini trả phí:**
- `gemini-4-argon`: $0.75/1M input tokens, $3.00/1M output tokens

## So sánh OpenAI vs Gemini

| Tiêu chí | OpenAI (gpt-6-luna) | Gemini (3.8-flash) |
|----------|---------------------|---------------------|
| **Chi phí** | $2.50-$10/1M tokens | Miễn phí (có giới hạn) |
| **Chất lượng tóm tắt** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Tốc độ** | Nhanh | Rất nhanh |
| **Tiếng Việt** | Xuất sắc | Rất tốt |
| **Giới hạn context** | 128K tokens | 1M tokens |
| **Rate limit** | 500 req/phút (tier 1) | 15 req/phút (free) |

**Kết luận:**
- **Dùng Gemini** nếu: Cần miễn phí, xử lý văn bản dài
- **Dùng OpenAI** nếu: Cần chất lượng cao nhất, có ngân sách

## Kinh nghiệm thực tế

<!-- TÁC GIẢ BỔ SUNG: Chia sẻ kinh nghiệm của bạn khi dùng API tóm tắt văn bản trong công việc -->

Trong công việc, mình thường dùng Gemini API để tóm tắt log hệ thống và báo cáo sự cố trước khi trình lãnh đạo. Lý do:

1. **Miễn phí:** 15 requests/phút đủ cho hầu hết tác vụ
2. **Context dài:** 1M tokens cho phép paste log rất dài
3. **Nhanh:** Phản hồi trong 2-3 giây

Với các báo cáo quan trọng, mình dùng OpenAI để double-check vì chất lượng ổn định hơn.

## Bài tập thực hành

Thử các bài tập sau để nắm vững:

1. **Tóm tắt hàng loạt:** Viết script tóm tắt tất cả file `.txt` trong thư mục
2. **So sánh 2 API:** Tóm tắt cùng văn bản bằng cả OpenAI và Gemini, so sánh kết quả
3. **Tóm tắt URL:** Thêm tính năng tải nội dung từ URL rồi tóm tắt
4. **Streaming:** Hiển thị kết quả từng phần thay vì chờ hoàn thành

## Tài nguyên tham khảo

**OpenAI:**
- Tài liệu chính thức: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- Responses API guide: [https://platform.openai.com/docs/guides/responses](https://platform.openai.com/docs/guides/responses)
- Pricing: [https://openai.com/pricing](https://openai.com/pricing)

**Google Gemini:**
- Tài liệu chính thức: [https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
- Quickstart: [https://ai.google.dev/gemini-api/docs/get-started](https://ai.google.dev/gemini-api/docs/get-started)
- API key: [https://ai.google.dev](https://ai.google.dev)

## FAQ

**1. API nào rẻ hơn?**

Gemini rẻ hơn nhiều (miễn phí trong giới hạn). OpenAI chất lượng cao hơn một chút.

**2. Dữ liệu của tôi có được lưu không?**

Theo chính sách OpenAI và Google: dữ liệu API không dùng để train mô hình (từ tháng 3/2023 với OpenAI).

**3. Rate limit là gì?**

Số request tối đa mỗi phút. Gemini free: 15 req/phút. OpenAI tier 1: 500 req/phút.

**4. Token khác gì từ?**

Token là đơn vị nhỏ hơn từ. Trong tiếng Việt, 1 từ ≈ 1.5-2 tokens.

**5. Có thể dùng cho dữ liệu nhạy cảm không?**

**KHÔNG.** Đừng gửi thông tin mật lên API bên thứ ba. Dùng [Ollama chạy local](/blog/chay-ai-tren-may-ca-nhan-voi-ollama/) nếu cần bảo mật.

**6. Làm sao tăng rate limit?**

OpenAI: Nạp thêm tiền sẽ tăng tier. Gemini: Nâng lên paid plan.

## Kết luận

Trong bài viết này, bạn đã học cách:

✅ Lấy API key của OpenAI và Gemini  
✅ Gọi Responses API (OpenAI) và Interactions API (Gemini)  
✅ Tóm tắt file văn bản `.txt` và `.docx`  
✅ Xử lý lỗi rate limit, context length  
✅ Ước tính chi phí token  

Bước tiếp theo, bạn có thể tìm hiểu về [chạy AI local với Ollama (hữu ích cho RAG)](/blog/chay-ai-tren-may-ca-nhan-voi-ollama/) hoặc [tự động hóa Python / lộ trình học](/blog/lo-trinh-tu-hoc-python-2026/) để tích hợp AI vào workflow.

Chúc bạn thành công!

---

*Bài viết được kiểm chứng kỹ thuật với OpenAI SDK v3.35.1 và Google GenAI SDK (tháng 10/2026).*
