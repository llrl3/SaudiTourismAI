from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

import os
import json
import re
import logging
import uuid
import base64

from pathlib import Path
from pydantic import BaseModel
from typing import Optional

from google import genai
from google.genai import types


# =========================================================
# إعدادات المشروع
# =========================================================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
LLM_MODEL = "gemini-3.5-flash-lite"

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)


# =========================================================
# FastAPI
# =========================================================

app = FastAPI(
    title="دليل رحلتك API",
    version="1.0.0"
)

api_router = APIRouter(prefix="/api")


# =========================================================
# Logging
# =========================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =========================================================
# حفظ المحادثات
# =========================================================

chat_sessions = {}


# =========================================================
# Gemini
# =========================================================

async def generate_text(prompt: str, system_message: str) -> str:

    response = await gemini_client.aio.models.generate_content(
        model=LLM_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_message
        )
    )

    if not response.text:
        raise HTTPException(
            status_code=500,
            detail="Gemini returned an empty response"
        )

    return response.text


# =========================================================
# استخراج JSON
# =========================================================

def extract_json(text: str):

    text = text.strip()

    fence = re.search(
        r"```(?:json)?\s*(.*?)```",
        text,
        re.DOTALL | re.IGNORECASE
    )

    if fence:
        text = fence.group(1).strip()

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:
        text = text[start:end + 1]

    return json.loads(text)


# =========================================================
# Models
# =========================================================

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    response: str


class ImageAnalyzeRequest(BaseModel):
    image_base64: str
    question: Optional[str] = "ما هذا المكان؟"


class ItineraryRequest(BaseModel):
    city: str
    people: int = 2
    days: int = 3
    has_children: bool = False
    start_time: str = "09:00"
    trip_type: str = "عائلية"


# =========================================================
# Root
# =========================================================

@api_router.get("/")
async def root():

    return {
        "message": "دليل رحلتك API",
        "status": "running"
    }


# =========================================================
# CHAT
# =========================================================

@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):

    # إنشاء session جديدة إذا لم تكن موجودة
    session_id = req.session_id or str(uuid.uuid4())

    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    # -----------------------------------------------------
    # حفظ رسالة المستخدم
    # -----------------------------------------------------

    chat_sessions[session_id].append({
        "role": "user",
        "content": req.message
    })

    # -----------------------------------------------------
    # تعليمات المساعد
    # -----------------------------------------------------

    system = """
أنت «دليل»، دليل سياحي ذكي وتفاعلي للزوار في المواقع السياحية والتراثية في المملكة العربية السعودية.

مهمتك:
تقديم تجربة بسيطة، ممتعة، إنسانية، وسريعة للزائر، وكأنك ترافقه بنفسك في المكان.

الشخصية والأسلوب:

- تحدث بالعربية بشكل طبيعي وسهل.
- استخدم أسلوبًا ودودًا وعفويًا.
- كن متحمسًا بشكل طبيعي ومعتدل، بدون مبالغة.
- كن سريعًا ومختصرًا ومباشرًا.
- لا تطيل الإجابة بدون سبب.
- ركز على ما يحتاجه الزائر في اللحظة الحالية.
- لا تستخدم لغة رسمية أو آلية بشكل زائد.
- لا تكرر كلام المستخدم إلا إذا كان ضروريًا.
- لا تستخدم قوائم طويلة إلا عندما تكون مفيدة فعلًا.
- لا تذكر أنك نموذج ذكاء اصطناعي.

الدقة والموثوقية:

- الدقة أهم من إعطاء إجابة بأي شكل.
- لا تخترع أي معلومة.
- لا تخمن اسم مكان أو معلم أو فعالية أو تاريخ أو سعر أو وقت عمل أو مسافة.
- إذا لم تكن متأكدًا من معلومة، قل بوضوح إنك غير متأكد.
- لا تقدم معلومة قديمة على أنها معلومة حالية.
- عندما تكون المعلومة قابلة للتغيير، مثل الأسعار وأوقات العمل والفعاليات والحجوزات، اعتمد على المعلومات الحديثة والموثوقة المتاحة.
- أعط الأولوية للمعلومات الرسمية السعودية والجهات الرسمية المرتبطة بالموقع.
- من أمثلة المصادر ذات الأولوية: وزارة السياحة، Visit Saudi، وزارة الثقافة، هيئة التراث، وهيئات تطوير المناطق والمدن والجهات الرسمية المسؤولة عن الوجهة.
- لا تدّعي أنك تحققت من مصدر إذا لم تتحقق منه فعليًا.
- لا تذكر المصادر في كل إجابة.
- اذكر المصدر فقط عندما يكون مهمًا أو عندما يطلبه المستخدم.

عند سؤال المستخدم عن مكان سياحي:

- اشرح باختصار ما هو المكان ولماذا قد يستحق الزيارة.
- اذكر أهم شيء يمكن للزائر فعله أو ملاحظته.
- إذا كانت هناك خطوة تالية مفيدة، اقترحها بجملة قصيرة.
- لا تحول الإجابة إلى معلومات تاريخية طويلة إلا إذا طلب المستخدم ذلك.

عند إرسال صورة:

- حلل ما يظهر في الصورة فقط.
- إذا كنت واثقًا من المكان، اذكره.
- إذا لم تكن متأكدًا، لا تخمن.
- قل بوضوح إنك لا تستطيع تحديد المكان بثقة من الصورة وحدها.
- اشرح ما يراه المستخدم الآن باختصار، من 3 إلى 4 جمل كحد أقصى.
- لا تخترع تفاصيل غير ظاهرة في الصورة.

فهم المستخدم وسياق المحادثة:

- افهم اللهجة السعودية والأخطاء الإملائية البسيطة.
- اقرأ المحادثة السابقة كاملة قبل الرد.
- اعتبر رسالة المستخدم الحالية استمرارًا للمحادثة نفسها.
- إذا كان المستخدم يجيب عن سؤال طرحته أنت سابقًا، اعتبر كلامه إجابة مباشرة على ذلك السؤال.
- لا تسأل المستخدم مرة أخرى عن معلومة سبق أن أعطاها.
- احتفظ بسياق الرحلة، والمدينة، وعدد الأشخاص، وأعمارهم، ووجود الأطفال، وأعمار الأطفال، ووقت بداية اليوم.
- إذا كانت المعلومة موجودة في المحادثة السابقة فلا تطلبها مرة أخرى.
- إذا كان السؤال واضحًا، أجب مباشرة.
- إذا كان هناك غموض يمنع الإجابة، اسأل سؤالًا واحدًا قصيرًا فقط.

التوصيات:

- قدم اقتراحات قليلة ومناسبة بدل قائمة طويلة.
- استخدم أماكن حقيقية ومعروفة.
- لا تخترع أماكن.
- راعِ المدينة والمنطقة وسياق سؤال المستخدم.
- إذا كانت التوصية تعتمد على معلومات متغيرة، استخدم المعلومات الحديثة الموثوقة المتاحة.

عند طلب جدول أو خطة رحلة:

لا تنشئ الجدول مباشرة إذا كانت المعلومات ناقصة.

تحتاج فقط إلى هذه المعلومات الثلاثة:

1. كم عددكم وكم أعماركم؟
2. هل معكم أطفال؟ وإذا نعم كم أعمارهم؟
3. متى تحبون يبدأ يومكم؟

إذا كان المستخدم قد أعطاك أيًا من هذه المعلومات سابقًا، لا تسأله عنها مرة أخرى.

إذا اكتملت المعلومات المطلوبة:

- أنشئ خطة مختصرة.
- قسمها إلى صباح / عصر / مساء.
- اجعلها سهلة وسريعة القراءة.
- لا تضف تفاصيل زائدة.
- استخدم أماكن حقيقية.
- راعِ أعمار المجموعة ووجود الأطفال ووقت بداية اليوم.
- اجعل ترتيب الأماكن والأنشطة منطقيًا.
- لا تضف معلومات غير مؤكدة.

قاعدة أساسية:

إذا كنت لا تعرف المعلومة، قل إنك لا تعرف أو أنك غير متأكد.
لا تخترع إجابة فقط لتبدو ذكيًا.

الأولوية:

الدقة ثم فهم سياق المحادثة ثم فهم طلب المستخدم ثم الاختصار والسرعة ثم الأسلوب الودود.
"""

    # -----------------------------------------------------
    # بناء المحادثة السابقة
    # -----------------------------------------------------

    conversation = "\n\n".join(
        f"{'المستخدم' if msg['role'] == 'user' else 'المساعد'}: {msg['content']}"
        for msg in chat_sessions[session_id]
    )

    prompt = f"""
هذه هي المحادثة السابقة كاملة:

---

{conversation}

---

اقرأ المحادثة السابقة جيدًا.

أجب الآن عن آخر رسالة للمستخدم.

مهم جدًا:

- لا تعيد سؤالًا سبق أن أجاب عنه المستخدم.
- إذا كانت رسالة المستخدم الحالية إجابة على سؤال سابق منك، تعامل معها كإجابة مباشرة.
- حافظ على سياق المحادثة.
- لا تبدأ المحادثة من الصفر.
"""

    try:

        # -------------------------------------------------
        # إرسال المحادثة إلى Gemini
        # -------------------------------------------------

        reply = await generate_text(
            prompt=prompt,
            system_message=system
        )

        # -------------------------------------------------
        # حفظ رد المساعد
        # -------------------------------------------------

        chat_sessions[session_id].append({
            "role": "assistant",
            "content": reply
        })

        # -------------------------------------------------
        # الاحتفاظ بآخر 20 رسالة فقط
        # -------------------------------------------------

        if len(chat_sessions[session_id]) > 20:
            chat_sessions[session_id] = (
                chat_sessions[session_id][-20:]
            )

        return ChatResponse(
            session_id=session_id,
            response=reply
        )

    except HTTPException:
        raise

    except Exception as e:

        logger.exception("chat failed")

        raise HTTPException(
            status_code=500,
            detail=f"AI error: {str(e)}"
        )


# =========================================================
# ANALYZE IMAGE
# =========================================================

@api_router.post("/analyze-image")
async def analyze_image(req: ImageAnalyzeRequest):

    b64 = req.image_base64
    mime_type = "image/jpeg"

    if b64.startswith("data:"):

        try:
            header, b64 = b64.split(",", 1)

            match = re.search(
                r"data:(image/[^;]+);base64",
                header
            )

            if match:
                mime_type = match.group(1)

        except ValueError:

            raise HTTPException(
                status_code=400,
                detail="Invalid image data"
            )

    try:

        image_bytes = base64.b64decode(
            b64,
            validate=True
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid image base64"
        )

    system = """
أنت «دليل»، دليل سياحي ذكي متخصص في المواقع السياحية والتراثية في المملكة العربية السعودية.

حلل الصورة بدقة ولا تخمن.

إذا كنت واثقًا من المكان، اذكر اسمه.
إذا لم تكن واثقًا، اجعل confidence منخفضًا واكتب «غير معروف».

أعد النتيجة بصيغة JSON فقط بهذا الشكل:

{
  "place": "اسم المكان أو غير معروف",
  "confidence": 0,
  "description": "وصف مختصر لما يظهر في الصورة",
  "tourist_info": "معلومات سياحية مفيدة",
  "activities": [],
  "nearby": []
}

القواعد:

- لا تخترع اسم المكان.
- لا تخترع معلومات تاريخية.
- لا تخمن.
- صف ما يظهر في الصورة فعلًا.
- إذا لم تستطع تحديد المكان بثقة، اكتب «غير معروف».
- لا تعتبر أي مكان صحيحًا لمجرد أن الصورة تشبهه.
- لا تذكر اسم مكان محدد إلا إذا كانت الأدلة المرئية في الصورة تدعمه بوضوح.
- إذا كانت الصورة لا تحتوي على دليل كافٍ لتحديد المكان، استخدم «غير معروف».
- لا تستنتج المدينة أو الدولة من مجرد شكل المباني أو التضاريس.
- اكتب جميع النصوص باللغة العربية.
"""

    prompt = f"""
سؤال المستخدم:

{req.question}

حلل الصورة وأعد JSON فقط.
"""

    try:

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type
        )

        response = await gemini_client.aio.models.generate_content(
            model=LLM_MODEL,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text=prompt
                        ),
                        image_part
                    ]
                )
            ],
            config=types.GenerateContentConfig(
                system_instruction=system,
                response_mime_type="application/json"
            )
        )

        raw = response.text or ""

        try:

            data = extract_json(raw)

        except Exception:

            data = {
                "place": "غير معروف",
                "confidence": 0,
                "description": raw[:500],
                "tourist_info": "",
                "activities": [],
                "nearby": []
            }

        return data

    except HTTPException:
        raise

    except Exception as e:

        logger.exception("analyze image failed")

        raise HTTPException(
            status_code=500,
            detail=f"AI error: {str(e)}"
        )


# =========================================================
# ITINERARY
# =========================================================

@api_router.post("/itinerary")
async def itinerary(req: ItineraryRequest):

    children = (
        "يوجد أطفال"
        if req.has_children
        else "بدون أطفال"
    )

    system = """
أنت «دليل»، مخطط رحلات سياحية محترف في المملكة العربية السعودية.

أنشئ خطة مختصرة وواقعية وسهلة القراءة.

أعد النتيجة بصيغة JSON فقط بهذا الشكل:

{
  "title": "عنوان الرحلة",
  "city": "المدينة",
  "days": [
    {
      "day": 1,
      "items": [
        {
          "time": "09:00",
          "place": "اسم المكان",
          "activity": "النشاط",
          "description": "وصف قصير",
          "duration": "ساعتان"
        }
      ]
    }
  ]
}

القواعد:

- استخدم أماكن حقيقية ومعروفة.
- لا تخترع أماكن.
- اجعل الأوقات متسلسلة ومنطقية.
- ابدأ من وقت البداية المحدد.
- اكتب بالعربية.
- لا تضف أي نص خارج JSON.
"""

    prompt = f"""
خطط رحلة إلى مدينة {req.city} لمدة {req.days} أيام.

عدد الأفراد:
{req.people}

الأطفال:
{children}

نوع الرحلة:
{req.trip_type}

وقت بداية اليوم:
{req.start_time}

قدم من 3 إلى 4 أنشطة لكل يوم.

استخدم أماكن سياحية حقيقية ومعروفة في المدينة.
"""

    try:

        raw = await generate_text(
            prompt=prompt,
            system_message=system
        )

        data = extract_json(raw)

        return data

    except HTTPException:
        raise

    except Exception as e:

        logger.exception("itinerary failed")

        raise HTTPException(
            status_code=500,
            detail=f"AI error: {str(e)}"
        )


# =========================================================
# DESTINATION SUGGESTIONS
# =========================================================

@api_router.post("/destination-suggestions")
async def destination_suggestions(payload: dict):

    city = payload.get("city", "")

    if not city:
        raise HTTPException(
            status_code=400,
            detail="city is required"
        )

    system = """
أنت «دليل»، مرشد سياحي سعودي.

أعد JSON فقط بهذا الشكل:

{
  "suggestions": [
    "اقتراح 1",
    "اقتراح 2",
    "اقتراح 3"
  ]
}

القواعد:

- الاقتراحات يجب أن تكون مناسبة للمدينة.
- استخدم أماكن حقيقية.
- لا تخترع أماكن.
- اكتب بالعربية.
- لا تضف أي نص خارج JSON.
"""

    prompt = f"""
أعطني 3 اقتراحات مميزة وذكية لزيارة مدينة {city}.
"""

    try:

        raw = await generate_text(
            prompt=prompt,
            system_message=system
        )

        data = extract_json(raw)

        return data

    except HTTPException:
        raise

    except Exception as e:

        logger.exception("suggestions failed")

        raise HTTPException(
            status_code=500,
            detail=f"AI error: {str(e)}"
        )


# =========================================================
# Router
# =========================================================

app.include_router(api_router)


# =========================================================
# CORS
# =========================================================

cors_origins = os.environ.get(
    "CORS_ORIGINS",
    "*"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"]
)