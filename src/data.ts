import { MempelaDetail, AgendaEvent } from "./types";

export const mempelaiPria: MempelaDetail = {
  role: "pria",
  fullName: "Arya Wijaya Sangaji, S.T.",
  nickName: "Arya",
  photoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  fatherName: "Bapak H. Amran Sangaji, M.B.A.",
  motherName: "Ibu Hj. Rina Herawati",
  instagram: "https://instagram.com/arya.sangaji",
};

export const mempelaiWanita: MempelaDetail = {
  role: "wanita",
  fullName: "Shinta Laksmi Wardhani, S.I.Kom.",
  nickName: "Shinta",
  photoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  fatherName: "Bapak Drs. H. Bambang Wardhana",
  motherName: "Ibu Hj. Siti Aminah",
  instagram: "https://instagram.com/shinta.wardhani",
};

export const targetWeddingDate = "2026-09-12T09:00:00+07:00"; // Saturday, 12 Sept 2026 09.00 WIB

export const bcaAccount = {
  bankName: "Bank Central Asia (BCA)",
  name: "Arya Wijaya Sangaji",
  number: "123-098-4567",
};

export const mandiriAccount = {
  bankName: "Bank Mandiri",
  name: "Shinta Laksmi Wardhani",
  number: "142-00-9876543-2",
};

export const giftAddress = {
  name: "Kediaman Mempelai Wanita",
  address: "Jl. Diponegoro No. 45, Menteng, Kota Jakarta Pusat, DKI Jakarta 10310",
  receiver: "Bapak Bambang Wardhana / Shinta",
};

export const agendaAkad: AgendaEvent = {
  title: "Akad Nikah",
  dateStr: "Sabtu, 12 September 2026",
  timeStr: "08:00 - 10:00 WIB",
  locationName: "Masjid Agung Sunda Kelapa",
  address: "Jl. Taman Sunda Kelapa No. 16, Menteng, Kec. Menteng, Kota Jakarta Pusat, 10310",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3966.4526019599554!2d106.83155797587844!3d-6.203871993783935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f41764eb8cf3%3A0xc3f8e5b66d5b03bc!2sMasjid%20Agung%20Sunda%20Kelapa!5e0!3m2!1sid!2sid!4v1716380000000!5m2!1sid!2sid",
  mapNavigationUrl: "https://maps.apple.com/?address=Masjid%20Agung%20Sunda%20Kelapa&ll=-6.203872,106.831558&q=Arah%20Lokasi",
};

export const agendaResepsi: AgendaEvent = {
  title: "Resepsi Pernikahan",
  dateStr: "Sabtu, 12 September 2026",
  timeStr: "11:00 - 14:00 WIB",
  locationName: "Gedung Serbaguna Sunda Kelapa",
  address: "Kawasan Masjid Agung Sunda Kelapa, Menteng, Kota Jakarta Pusat, 10310",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3966.4526019599554!2d106.83155797587844!3d-6.203871993783935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f41764eb8cf3%3A0xc3f8e5b66d5b03bc!2sMasjid%20Agung%20Sunda%20Kelapa!5e0!3m2!1sid!2sid!4v1716380000000!5m2!1sid!2sid",
  mapNavigationUrl: "https://maps.google.com/?q=Masjid+Agung+Sunda+Kelapa+Menteng",
};

export const galleryImages = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    caption: "Momen Kebersamaan",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
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
