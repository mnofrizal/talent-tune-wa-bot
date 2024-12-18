const templates = {
  fitAndProper: {
    template: `Selamat Siang Bapak/Ibu {name}
Sehubungan dengan pelaksanaan Fit and Proper Test untuk memotret Kompetensi maupun Potensi Pegawai ke jenjang {grade}.

Berikut kami sampaikan link aplikasi Talent Tune untuk melihat Jadwal, Evaluator dan konfirmasi kehadiran:

{link}

Demikian disampaikan, atas perhatian dan kerja samanya diucapkan terima kasih.                                          

Salam,
Administrasi Perencanaan & Evaluasi SDM SLA PGU`,
  },
  pemesananMakanan: {
    template: `*Pemesanan {zonaWaktu}*
*{judulPekerjaan}*
Bidang: {subBidang}
Drop Point: {dropPoint}
Total Pesanan: {totalEmployees} porsi
Waktu Pemesanan: {timestamp}

Apabila Pesanan Sudah sesuai, silahkan klik link diwabh ini untuk konfirmasi

{link}`,
  },
};

function compileTemplate(templateName, data) {
  let message = templates[templateName]?.template;

  if (!message) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Replace all placeholders with actual data
  Object.entries(data).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, "g"), value);
  });

  return message;
}

module.exports = {
  templates,
  compileTemplate,
};
