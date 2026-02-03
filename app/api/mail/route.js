import nodemailer from "nodemailer";

export async function POST(request) {
  const {
    name,
    email,
    phone,
    product,
    id,
    message,
  } = await request.json();

  if (!name || !phone) {
    return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Заявка с сайта" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: "Новая заявка с сайта",
      html: `
        <h2>Новая заявка</h2>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        ${email ? `<p><b>Email:</b> ${email}</p>` : ""}
        ${product ? `<p><b>Товар:</b> ${product}</p>` : ""}
        ${id ? `<p><b>ID товара:</b> ${id}</p>` : ""}
        ${message ? `<p><b>Сообщение:</b><br/>${message}</p>` : ""}
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
        { error: "Mail send failed" },
        { status: 500 }
    );
  }
}
