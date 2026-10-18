import type { Metadata } from "next";
import { Reveal } from "@/components/Motion";
import Timeline, { SkillBars } from "@/components/Timeline";

export const metadata: Metadata = { title: "เกี่ยวกับ" };

// TODO: replace with your real story
const STORY = [
  { when: "2026 · ตอนนี้", icon: "☾", title: "e-Meeting System", text: "พัฒนา prototype ระบบบริหารการประชุมและจองห้องประชุมด้วย Next.js + TypeScript" },
  { when: "2026 · ฝึกงาน", icon: "◎", title: "ระบบแจ้งเบาะแส", text: "ช่วยพัฒนาระบบรับแจ้งเบาะแสออนไลน์สำหรับองค์กร" },
  { when: "2025", icon: "◆", title: "Blockchain Certificate", text: "ทำระบบออกและตรวจสอบใบรับรองบน blockchain" },
  { when: "เริ่มต้น", icon: "🐾", title: "เริ่มเขียนโค้ด", text: "หลงรักการสร้างสิ่งที่คนใช้ได้จริง ตั้งแต่บรรทัดแรก" },
];

const FACTS = [
  { i: "✦", t: "ชอบความสงบ", d: "โฟกัสงานได้นาน ทำงานคนเดียวได้ดี แต่ก็สนุกกับการทำงานเป็นทีม" },
  { i: "☾", t: "สายกลางคืน", d: "ไอเดียดี ๆ มักมาตอนดึก (และ bug ก็เช่นกัน)" },
  { i: "◎", t: "เรียนรู้ไม่หยุด", d: "ชอบลองเทคโนโลยีใหม่ แล้วเอามาใช้กับงานจริง" },
  { i: "🐾", t: "ทาสแมว", d: "มีผู้ช่วยเป็นแมวดำ ลองกดที่แมวบนแถบด้านบนดูสิ" },
];

export default function About() {
  return (
    <>
      <section className="page-top">
        <div className="wrap">
          <Reveal><p className="eyebrow">About me</p></Reveal>
          <Reveal delay={0.08}><h2>เรื่องราวของฉัน, <span className="serif">so far.</span></h2></Reveal>
          <Reveal delay={0.16}><p className="lead">นักพัฒนาที่ชอบความสงบ สนใจทั้งงานหน้าบ้านและหลังบ้าน เส้นทางที่ผ่านมาสรุปไว้ตรงนี้</p></Reveal>
          <Timeline items={STORY} />
        </div>
      </section>
      <section className="tint">
        <div className="wrap">
          <Reveal><p className="eyebrow">Skills</p></Reveal>
          <Reveal delay={0.08}><h2>ระดับความถนัด</h2></Reveal>
          <SkillBars items={[["TypeScript", 80], ["Next.js / React", 75], ["CSS & Motion", 70], ["Node.js / API", 60], ["UI Design", 65]]} />
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
