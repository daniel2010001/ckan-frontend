import { NoticesResponse, Notice } from "@/models";

export class NoticeAdapter {
  static toNotice(notice: NoticesResponse): Notice {
    return {
      title: notice.titulo,
      image: "https://cochabamba.bo/" + notice.archivo,
      date: new Date(notice.fecha),
      url: "https://cochabamba.bo/noticias/" + notice.slug,
    };
  }
}
