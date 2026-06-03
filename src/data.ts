import { MempelaDetail, AgendaEvent, LoveStory } from "./types";

export const mempelaiPria: MempelaDetail = {
  role: "pria",
  fullName: "Gian Nugraha",
  nickName: "Gian",
  photoUrl: "url('/wedding/images/male.jpeg')?auto=format&fit=crop&q=80&w=800",
  fatherName: "Bapak Endang Sudrajat",
  motherName: "Ibu Siti Mariyam",
  instagram: "https://instagram.com/nugrahagiangn",
};

export const mempelaiWanita: MempelaDetail = {
  role: "wanita",
  fullName: "Cucu Rohimas",
  nickName: "Cucu", 
  photoUrl: "url('/wedding/images/female.jpeg')?auto=format&fit=crop&q=80&w=800",
  fatherName: "Bapak - Pudin",
  motherName: "Ibu - Oyoh",
  instagram: "https://instagram.com/cucu_rohimas",
};

export const targetWeddingDate = "2026-06-28T08:00:00+07:00"; // Thursday, 28 Juni 2026 08:00 WIB

export const bcaAccount = {
  bankName: "Bank Central Asia (BCA)",
  name: "Gian Nugraha",
  number: "67-555-62860",
};

export const mandiriAccount = {
  bankName: "Bank Rakyat Indonesia (BRI)",
  name: "Cucu Rohimas",
  number: "002-5011-4135750-8",
};

export const giftAddress = {
  name: "Kediaman Mempelai Wanita",
  address: "Kp. Manguneng RT/RW 04/09, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut, 44165",
  receiver: "Teh Nelis / Cucu",
};

export const agendaAkad: AgendaEvent = {
  title: "Akad Nikah",
  dateStr: "Ahad, 28 Juni 2026",
  timeStr: "08:00 - 10:00 WIB",
  locationName: "Rumah Kediaman Mempelai Wanita",
  address: "Kp. Manguneng RT/RW 04/09, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut, 44165",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.442903517223!2d107.6073002!3d-7.4550998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6620f002feaf33%3A0x2ecf07b5c7c24898!2sTOKO%20SRC%20Ucu!5e0!3m2!1sen!2sid!4v1700000000000",
  mapNavigationUrl: "https://maps.app.goo.gl/Vh5EfmQCjjRFbQJm6",
};

export const agendaResepsi: AgendaEvent = {
  title: "Resepsi Pernikahan",
  dateStr: "Ahad, 28 Juni 2026",
  timeStr: "10:00 - selesai WIB",
  locationName: "Rumah Kediaman Mempelai Wanita",
  address: "Kp. Manguneng RT/RW 04/09, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut, 44165",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.442903517223!2d107.6073002!3d-7.4550998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6620f002feaf33%3A0x2ecf07b5c7c24898!2sTOKO%20SRC%20Ucu!5e0!3m2!1sen!2sid!4v1700000000000",
  mapNavigationUrl: "https://maps.app.goo.gl/Vh5EfmQCjjRFbQJm6",
};

export const galleryImages = [
  {
    id: "g1",
    // url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    url: "url('/wedding/images/male.jpeg')?auto=format&fit=crop&q=80&w=800",
    caption: "Momen Kebersamaan",
  },
  {
    id: "g2",
    // url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    url: "url('/wedding/images/bg.jpeg')?auto=format&fit=crop&q=80&w=800",
    caption: "Buket Bunga Impian",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    caption: "Simbol Ikatan Suci",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
    caption: "Langkah Bersama",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    caption: "Pesta Keakraban",
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800",
    caption: "Kue Pernikahan Cantik",
  },
];

export const loveStories: LoveStory[] = [
  {
    id: "story-1",
    title: "Awal Pertemuan",
    dateStr: "Oktober 2020",
    description: "Tuhan menakdirkan pertemuan pertama kami secara tak sengaja. Bermula dari sebuah obrolan sederhana yang penuh canda tawa, ada secercah keyakinan kecil di lubuk hati bahwa kebersamaan ini tidak akan berlalu begitu saja.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "story-2",
    title: "Menjalin Hubungan",
    dateStr: "Maret 2021",
    description: "Seiring berjalannya waktu, kami memutuskan untuk berkomitmen melangkah bersama. Melalui suka dan duka kehidupan, saling memahami segala kekurangan, dan menguatkan satu sama lain untuk menjadi pribadi yang lebih baik setiap harinya.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "story-3",
    title: "Momen Lamaran (Proposal)",
    dateStr: "Desember 2025",
    description: "Di hadapan kedua keluarga besar, kami mengikrarkan janji suci pertunangan. Langkah penuh keberanian untuk menyatukan visi, restu tulus orang tua menuntun kami menuju pintu gerbang yang mulia ini.",
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "story-4",
    title: "Pernikahan Suci",
    dateStr: "Mei 2026",
    description: "Hari bersejarah yang dinanti pun tiba. Dengan tulus ikhlas serta restu semesta, kami dipersatukan dalam ikatan pernikahan yang sah dan abadi. Lembaran baru petualangan cinta kami pun dimulai hari ini.",
    imageUrl: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800"
  }
];
