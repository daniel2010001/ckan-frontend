import { NoticesResponse, Notice } from "@/models";
import { convertToSystemTimeZone } from "@/utils/data-validation";

export class NoticeAdapter {
  static toNotice(notice: NoticesResponse): Notice {
    return {
      title: notice.titulo,
      image: "https://cochabamba.bo/" + notice.archivo,
      date: convertToSystemTimeZone(notice.fecha),
      url: "https://cochabamba.bo/noticias/" + notice.slug,
    };
  }
}
