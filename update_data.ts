import { db } from './src/db/index.ts';
import { settings, projects, socialLinks } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function updateData() {
  console.log("Updating settings...");
  
  // Update hero
  await db.update(settings).set({
    value: {
      name: "عماد الحلقي",
      roles: ["مطور برمجيات", "محلل نظم", "متخصص في أنظمة تخطيط موارد المؤسسات (ERP)"],
      greeting: "مرحباً، أنا",
      description: "أصمم وأبني حلولاً برمجية متكاملة تدعم نمو الأعمال. أمتلك خبرة عميقة في تحليل الأنظمة، تطوير وتخصيص وحدات Odoo باستخدام Python، وإدارة قواعد البيانات المتقدمة عبر PostgreSQL. أحول العمليات المعقدة إلى أنظمة ذكية، سلسة، وعالية الأداء.",
      downloadCV: "تحميل السيرة الذاتية (CV)",
      viewProjects: "تصفح مشاريعي"
    }
  }).where(eq(settings.key, "hero"));

  // Update about
  await db.update(settings).set({
    value: {
      title: "نبذة عني",
      subtitle: "مطور برمجيات ومحلل نظم شغوف ببناء تطبيقات قوية.",
      journey: "أنا خريج تقنية معلومات (IT) من جامعة القلم لعام 2026. أؤمن بأن البرمجة ليست مجرد كتابة أكواد، بل هي هندسة لحل المشكلات. بجانب تركيزي على تطوير الأنظمة وعلوم البيانات واستخدام أدوات مثل Power BI و scikit-learn، أمتلك اهتمامات تصقل طريقة تفكيري كمطور.\n\nأستمتع بالتخطيط الاستراتيجي والتحليل الدقيق في لعبة الشطرنج، وهو ما ينعكس مباشرة على طريقتي في حل المشكلات البرمجية وحساب الخطوات المستقبلية للنظام. كما أنني أمتلك شغفاً بالجانب البصري وأدير علامتي الخاصة 'أبو علاء للتصوير الرقمي'، مما يمنحني منظوراً فريداً يجمع بين قوة الأداء البرمجي (Backend) وجماليات التجربة البصرية (Frontend)."
    }
  }).where(eq(settings.key, "about"));

  // Update contact
  await db.update(settings).set({
    value: {
      title: "دعنا نبني شيئاً مميزاً معاً",
      description: "سواء كنت تبحث عن تطوير نظام ERP مخصص لشركتك، أو تحتاج إلى استشارة في تحليل النظم وهيكلة قواعد البيانات، يسعدني تواصلك.",
      email: "eabdullrahman10@gmail.com",
      phone: "",
      address: ""
    }
  }).where(eq(settings.key, "contact"));

  // Insert or update projects
  const currentProjects = await db.select().from(projects);
  
  if (currentProjects.length > 0) {
    // Delete existing projects for a clean slate, or update them. We will just delete and insert to make it simple.
    await db.delete(projects);
  }
  
  await db.insert(projects).values([
    {
      title: "نظام أتمتة الاعتماد الأكاديمي (CAQA)",
      titleAr: "نظام أتمتة الاعتماد الأكاديمي (CAQA)",
      slug: "caqa-automation",
      description: "نظام برمجي متكامل تم تصميمه وبناؤه لأتمتة عمليات ومعايير مجلس الاعتماد الأكاديمي وضمان الجودة (CAQA).\n\nتمت إدارة دورة حياة المشروع باستخدام إطار العمل Agile Scrum. قمت بتصميم مخططات تدفق البيانات (DFD) ونمذجة عمليات الأعمال (BPMN) لضمان التوافق التام مع المعايير الأكاديمية الصارمة.\n\nالنتيجة: تحويل المتطلبات الأكاديمية الورقية والمعقدة إلى سير عمل رقمي مؤتمت يسهل إدارته وتتبعه ومطابقته مع معايير الجودة.",
      category: "ERP & Management",
      technologies: ["Odoo", "Python", "PostgreSQL"],
      images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"],
      published: true,
      featured: true,
    },
    {
      title: "مشروع التخرج (نظام إدارة المشاريع)",
      titleAr: "مشروع التخرج (دفعة صناع الأثر 2026)",
      slug: "graduation-project-2026",
      description: "تم تطوير هذا النظام كجزء من متطلبات التخرج بدرجة البكالوريوس في تقنية المعلومات من جامعة القلم.\n\nالعمل الجماعي: تم تنفيذ المشروع ضمن بيئة عمل تعاونية مع فريق التطوير (عصام الصرمة، محمد الخزرجي، حذيفة العثماني، ومحمد شايع)، مما يعكس القدرة على العمل ضمن فرق تقنية متكاملة.",
      category: "Academic",
      technologies: ["IT", "Teamwork", "Development"],
      images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000"],
      published: true,
      featured: true,
    }
  ]);
  
  console.log("Data updated successfully!");
  process.exit(0);
}

updateData().catch(e => {
  console.error(e);
  process.exit(1);
});
