# ebade Manifesto 🧠

> **"Code = f(intent)"** — Kod, niyetin bir fonksiyonu olmalı.

---

## Paradigma Değişimleri

| Feature | Traditional Frameworks | ebade (Agent-First) |
| :--- | :--- | :--- |
| **Primary User** | Human Developer | AI Agent |
| **Entry Point** | implementation.ts | project.ebade.yaml |
| **Context Size** | High (Boilerplate) | Ultra-Low (Essence) |
| **Logic** | Procedural "How" | Declarative "What" |
| **Testability** | External / Manual | Inherent / Inferred |
| **Carbon Footprint**| High (100%) | Low (~34%) |

---

## Mevcut Sorun

AI agent'lar şu anda **insan gibi davranmaya** zorlanıyor:

```
İnsan → Düşünür → Kod yazar → Framework → Çalışır
                     ↑
AI Agent → Düşünür → Kod yazar → Framework → Çalışır
                     ↑
           "İnsan gibi" kod yazmak zorunda
```

AI'ın doğal düşünce şekli:
- **Intent-based**: "Ne" olmasını istiyor
- **Declarative**: "Nasıl" değil "ne" 
- **Structured**: Belirsizlik yok

Ama mevcut framework'lar:
- **Imperative detaylar** istiyor
- **İnsan convention'ları** var
- **Belirsizliklerle** dolu

---

## Temel Kavramlar

### Intent
Bir şeyin **ne** yapması gerektiğinin tanımı.

```javascript
@intent('user-authentication')
@inputs(['email', 'password'])
@validates(['email-format', 'password-strength'])
@outcomes({
  success: 'redirect-to-dashboard',
  failure: 'show-error-message'
})
```

### Requires
Intent'in çalışması için gereken bağımlılıklar.

```javascript
@requires({
  data: ['user', 'products'],      // Veri bağımlılıkları
  auth: 'required',                 // Auth durumu
  permissions: ['can-checkout'],    // İzinler
  features: ['payments']            // Feature flags
})
```

### Outcomes
Olası sonuçlar ve ne yapılacağı.

```javascript
@outcomes({
  success: '/thank-you',
  error: { show: 'toast', message: 'context' },
  timeout: { retry: 3, fallback: 'offline-mode' }
})
```

### Style
Görsel tanım (design system'den).

```javascript
@style({
  variant: 'primary',
  size: 'lg',
  animation: 'subtle',
  theme: 'inherit'
})
```

```text
Goal → Implementation → Debugging → Refactoring
```

---

## Compilation Pipeline

```
Intent Definition (.intent.js)
        ↓
    [Parser]
        ↓
    Intent AST
        ↓
    [Compiler]
        ↓
    Target Framework Code (React, Vue, etc.)
        ↓
    [Runtime]
        ↓
    Working Application
```

---

## AI Agent Workflow

### Önceki (Şimdi)
```
User: "Checkout sayfası yap"
Agent: *Next.js docs'ı hatırla*
       *app router mı pages mı?*
       *server component mı client mı?*
       *500 satır kod yaz*
```

### ebade ile (Hybrid Workflow)
```text
Phase I: Offline Architect (Deterministic)
Agent: *node cli/scaffold.js build "A green dashboard"*
       -> 0 Tokens spent
       -> Mimar yerel olarak iskeleyi kurar

Phase II: Online Engineer (Generative)
Agent: *Arayüze özel iş mantığını (Business Logic) yaz*
       -> Düşük token harcaması
       -> Sadece yaratıcı işe odaklanma
```

---

## Hibrit Model: Mimar ve Mühendis

ebade, yazılım geliştirme sürecini ikiye böler:

### 1. 🛡️ Offline Mimar (Deterministik)

Yerel CLI, hiç token harcamadan projenin iskeletini, tasarım sistemini ve dosya düzenini kurar. Bu aşamada "halüsinasyon" yoktur, sadece saf mühendislik kuralları vardır.

### 2. 🧠 Online Mühendis (Generatif)

İskelet hazır olduktan sonra AI Ajanı (Cursor/Claude) koltuğa oturur. `project.ebade.yaml` dosyasını "Source of Truth" olarak kullanarak, projenin "ruhunu" (spesifik iş mantığı, API entegrasyonları) kodlar.

---

## Design Principles

1. **Agent-Native**: AI'ın düşünce yapısına uygun
2. **Human-Readable**: İnsan da okuyup anlayabilir
3. **Deterministic**: Aynı input = aynı output
4. **Composable**: Küçük parçalar büyük yapılar oluşturur
5. **Target-Agnostic**: Farklı framework'lere compile edilebilir

---

## Why Now?

1. **AI Coding Mainstream**: Cursor, Copilot, Claude yaygın
2. **Framework Fatigue**: Herkes yeni şeyler öğrenmekten yorgun
3. **Abstraction Ready**: TypeScript, JSX gibi katmanlar kabul gördü
4. **First Mover**: Henüz kimse yapmadı

---

## Vision

> ebade, AI agent'ların doğal dili. 
> İnsan niyeti ile çalışan kod arasındaki köprü.
> Framework'ler için TypeScript ne ise, AI için o.

---

**Built for AI, readable by humans.**
