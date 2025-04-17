# 📱 ScrollX – The Modern Reels Upload Platform

ScrollX is a sleek, high-performance short video (reels) sharing platform built with the modern web stack. Users can upload short reels (up to **20MB**) and engage with dynamic, mobile-first content. 

ScrollX is crafted with performance, design, and scalability in mind.

---

## 🚀 Features

- 🔄 Upload short videos (up to 20MB) powered by **ImageKit**
- 💨 Lightning-fast UI with **Next.js 14**
- 🎨 Beautifully styled using **TailwindCSS** + **ShadCN UI**
- 🧠 Strongly typed backend with **Prisma ORM** and **TypeScript**
- 🧾 PostgreSQL database schema with clear relational modeling
- 🔐 User authentication integrated with **Clerk**

---

## 🧱 Tech Stack

| Tech          | Purpose                            |
|---------------|------------------------------------|
| **Next.js**   | Full-stack React framework         |
| **Tailwind**  | Utility-first CSS for styling      |
| **Prisma**    | Type-safe database ORM             |
| **PostgreSQL**| Primary relational database        |
| **Clerk**     | Authentication & user management   |
| **ImageKit**  | Video storage & optimization       |
| **TypeScript**| Type safety across the stack       |

---

## 📸 Video Upload Configuration

- Uploads are handled via **ImageKit**
- Max file size: **20MB**
- File types: `video/mp4`, `video/webm`, etc.
- Validations ensure performance and responsiveness

---

---

## 🛠️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/SunilNeupane77/scrollx.git
cd scrollx

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your DATABASE_URL, CLERK_KEY, IMAGEKIT keys

# 4. Run Prisma migration
npx prisma migrate dev

# 5. Run the development server
npm run dev
```

