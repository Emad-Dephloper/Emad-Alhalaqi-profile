export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      portfolio: "Portfolio",
      services: "Services",
      blog: "Blog",
      resume: "Resume",
      contact: "Contact"
    },
    hero: {
      greeting: "Hi, I'm",
      name: "Emad Alhalaqi",
      roles: ["Software Engineer", "Odoo Developer", "Python Developer", "ERP Specialist", "AI Enthusiast", "Full Stack Developer"],
      description: "Building premium digital experiences and scalable enterprise solutions.",
      downloadCV: "Download CV",
      contactMe: "Contact Me",
      viewProjects: "View Projects"
    },
    stats: {
      yearsExp: "Years Experience",
      projects: "Projects Delivered",
      technologies: "Technologies",
      certificates: "Certificates"
    },
    about: {
      title: "About Me",
      subtitle: "Professional Story & Journey",
      description: "A passionate Software Engineer dedicated to solving complex problems through elegant, scalable code."
    }
    // Will expand this as needed
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "عني",
      portfolio: "أعمالي",
      services: "خدماتي",
      blog: "المدونة",
      resume: "السيرة الذاتية",
      contact: "تواصل معي"
    },
    hero: {
      greeting: "مرحباً، أنا",
      name: "عماد الحلقي",
      roles: ["مهندس برمجيات", "مطور أودو", "مطور بايثون", "أخصائي تخطيط موارد المؤسسات", "مهتم بالذكاء الاصطناعي", "مطور ويب متكامل"],
      description: "أبني تجارب رقمية احترافية وحلول مؤسسية قابلة للتطوير.",
      downloadCV: "تحميل السيرة الذاتية",
      contactMe: "تواصل معي",
      viewProjects: "شاهد أعمالي"
    },
    stats: {
      yearsExp: "سنوات الخبرة",
      projects: "مشروع منجز",
      technologies: "تقنية",
      certificates: "شهادة"
    },
    about: {
      title: "نبذة عني",
      subtitle: "القصة المهنية والرحلة",
      description: "مهندس برمجيات شغوف مكرس لحل المشكلات المعقدة من خلال كود أنيق وقابل للتطوير."
    }
  }
};

export type Language = 'en' | 'ar';
export type Translations = typeof translations.en;
