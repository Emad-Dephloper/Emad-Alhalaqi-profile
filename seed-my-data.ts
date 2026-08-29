import 'dotenv/config';
import { db } from './src/db/index';
import { settings, skills, projects, education } from './src/db/schema';

async function seed() {
  await db.insert(settings).values({
    key: 'hero',
    value: {
      name: 'عماد عبدالرحمن الحلقي',
      greeting: 'مرحباً، أنا',
      roles: ['مطور برمجيات', 'محلل نظم'],
      description: 'حاصل على بكالوريوس تقنية معلومات (IT) من جامعة القلم. متخصص في هندسة البرمجيات وتحليل النظم وتطوير حلول متكاملة.',
      downloadCV: 'تحميل السيرة الذاتية',
      viewProjects: 'تصفح المشاريع'
    }
  }).onConflictDoUpdate({
    target: settings.key,
    set: { value: {
      name: 'عماد عبدالرحمن الحلقي',
      greeting: 'مرحباً، أنا',
      roles: ['مطور برمجيات', 'محلل نظم'],
      description: 'حاصل على بكالوريوس تقنية معلومات (IT) من جامعة القلم. متخصص في هندسة البرمجيات وتحليل النظم وتطوير حلول متكاملة.',
      downloadCV: 'تحميل السيرة الذاتية',
      viewProjects: 'تصفح المشاريع'
    } }
  });

  await db.insert(settings).values({
    key: 'about',
    value: {
      title: 'نبذة عني',
      subtitle: 'مطور برمجيات ومحلل نظم شغوف ببناء تطبيقات قوية.',
      journey: 'حاصل على بكالوريوس تقنية معلومات (IT) من جامعة القلم.\n\nأعمل كمطور برمجيات ومحلل نظم، ولدي شغف كبير بتحليل المتطلبات وتحويلها إلى حلول برمجية متكاملة تواكب أحدث المعايير.'
    }
  }).onConflictDoUpdate({
    target: settings.key,
    set: { value: {
      title: 'نبذة عني',
      subtitle: 'مطور برمجيات ومحلل نظم شغوف ببناء تطبيقات قوية.',
      journey: 'حاصل على بكالوريوس تقنية معلومات (IT) من جامعة القلم.\n\nأعمل كمطور برمجيات ومحلل نظم، ولدي شغف كبير بتحليل المتطلبات وتحويلها إلى حلول برمجية متكاملة تواكب أحدث المعايير.'
    } }
  });

  await db.insert(skills).values([
    { name: 'Odoo', category: 'تخطيط الموارد (ERP)', level: 90, icon: 'Target', visible: true, orderIndex: 1 },
    { name: 'Python', category: 'لغات البرمجة', level: 95, icon: 'Code2', visible: true, orderIndex: 2 },
    { name: 'PostgreSQL', category: 'قواعد البيانات', level: 90, icon: 'Database', visible: true, orderIndex: 3 },
    { name: 'Firebase', category: 'البنية التحتية', level: 85, icon: 'Server', visible: true, orderIndex: 4 }
  ]);

  await db.insert(projects).values([
    {
      title: 'نظام أتمتة الاعتماد الأكاديمي (CAQA)',
      slug: 'caqa-system',
      description: 'نظام متكامل قمت بتصميمه وإدارته لأتمتة مراحل الاعتماد الأكاديمي بما يتوافق مع معايير الجودة. يبرز النظام قوة تحليل النظم وإدارة العمليات المعقدة.',
      category: 'أنظمة المؤسسات',
      tags: ['Odoo', 'Python', 'PostgreSQL', 'Systems Analysis'],
      published: true
    },
    {
      title: 'مشروع التخرج الجامعي',
      slug: 'graduation-project-2026',
      description: 'مشروع تخرج تمت مناقشته في أبريل 2026. تم تطويره بالتعاون مع فريق رائع مكون من: عصام الصرمة، محمد الخزرجي، حذيفة العثماني، ومحمد شايع.',
      category: 'أكاديمي',
      tags: ['Teamwork', 'IT', 'Software Engineering'],
      published: true
    },
    {
      title: 'منصة بروفايل شخصية',
      slug: 'personal-portfolio',
      description: 'المشروع الحالي الذي يتم من خلاله استعراض المهارات والمشاريع، ويتميز بربط الواجهات الأمامية التفاعلية بقواعد بيانات سحابية متطورة.',
      category: 'تطوير ويب',
      tags: ['React', 'PostgreSQL', 'Firebase', 'Full Stack'],
      published: true
    }
  ]);
  
  await db.insert(education).values([
    {
      university: 'جامعة القلم',
      degree: 'بكالوريوس تقنية معلومات (IT)',
      description: 'تخرجت بدرجة البكالوريوس مع مناقشة مشروع التخرج في أبريل 2026.'
    }
  ]);

  console.log('Seeded successfully!');
  process.exit(0);
}
seed().catch(console.error);
