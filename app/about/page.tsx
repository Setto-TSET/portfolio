import type { Metadata } from "next";
import { Reveal } from "@/components/Motion";
import Timeline from "@/components/Timeline";

export const metadata: Metadata = { title: "เกี่ยวกับ" };

const STORY = [
  { when: "2026", icon: "☾", title: "e-Meeting System", text: "พัฒนา prototype ระบบบริหารการประชุมและจองห้องประชุมด้วย Next.js + TypeScript" },
  { when: "โปรเจกต์มหาวิทยาลัย", icon: "◎", title: "Satisfaction Survey System", text: "เว็บแอปเก็บแบบสอบถามความพึงพอใจ React.js (frontend) + Node.js (backend) ออกแบบ schema MySQL และปรับ UX/UI ให้ใช้ง่ายขึ้น" },
  { when: "โปรเจกต์มหาวิทยาลัย", icon: "◆", title: "Hotel Booking Management System", text: "เว็บแอป full-stack สำหรับจองห้องพักด้วย PHP + MySQL หน้าจอ responsive ด้วย HTML/CSS ทำงานร่วมกันเป็นทีม" },
  { when: "2023 · ปัจจุบัน", icon: "✦", title: "มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ตาก", text: "วิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 3" },
  { when: "มี.ค. – มิ.ย. 2023", icon: "◇", title: "Part-time · 7-Eleven", text: "ฝึกความรับผิดชอบ ตรงต่อเวลา และงานบริการลูกค้าในสภาพแวดล้อมที่เร่งรีบ" },
  { when: "2016 – 2022", icon: "🐾", title: "โรงเรียนโกสัมพีวิทยา", text: "สายวิทย์-คณิต" },
];

const SKILLS = [
  { i: "⌘", t: "Languages", d: "Python, JavaScript (ES6+), Java, C, SQL, PHP, HTML5, CSS3" },
  { i: "◎", t: "Web Development", d: "React.js, Node.js, Tailwind CSS, Bootstrap" },
  { i: "◆", t: "Data Science", d: "NumPy, Matplotlib, Scikit-learn" },
  { i: "☾", t: "Database & Tools", d: "MySQL, VS Code, PyCharm" },
];

const FACTS = [
  { i: "✦", t: "จัดการเวลาได้ดี", d: "วางแผนงานเป็นขั้นตอน ส่งงานตรงเวลา" },
  { i: "◎", t: "เรียนรู้ไม่หยุด", d: "ชอบลองเทคโนโลยีใหม่ แล้วเอามาใช้กับงานจริง" },
  { i: "◆", t: "แก้ปัญหาเป็นระบบ", d: "ค่อย ๆ ไล่หาต้นเหตุ ไม่แก้แค่ปลายเหตุ" },
  { i: "🐾", t: "ทำงานเป็นทีม", d: "สื่อสารชัดเจน ภาษาไทย (เจ้าของภาษา) และอังกฤษ (ใช้งานได้)" },
];

export default function About() {
  return (
    <>
      <section className="page-top">
        <div className="wrap">
          <Reveal><p className="eyebrow">About me</p></Reveal>
          <Reveal delay={0.08}><h1 className="title">เรื่องราวของฉัน, <span className="serif">so far.</span></h1></Reveal>
          <Reveal delay={0.16}>
            <p className="lead">นักศึกษาวิศวกรรมคอมพิวเตอร์ชั้นปีที่ 3 ที่สนใจ Full-Stack Web Development ด้วย React, Node.js และ Python อยู่ที่กำแพงเพชร พร้อมใช้ทักษะในงานฝึกงานที่ท้าทายและช่วยให้ทีมสำเร็จ</p>
          </Reveal>
          <Timeline items={STORY} />
        </div>
      </section>
      <section className="tint">
        <div className="wrap">
          <Reveal><p className="eyebrow">Skills</p></Reveal>
          <Reveal delay={0.08}><h2>เครื่องมือที่ใช้</h2></Reveal>
          <div className="facts">
            {SKILLS.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.1}><h3><span>{f.i}</span>{f.t}</h3><p>{f.d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <Reveal><h2>เรื่องเล็ก ๆ <span className="serif">about me.</span></h2></Reveal>
          <div className="facts">
            {FACTS.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.1}><h3><span>{f.i}</span>{f.t}</h3><p>{f.d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
