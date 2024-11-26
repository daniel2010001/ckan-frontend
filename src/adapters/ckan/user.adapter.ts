import { User, UserResponse } from "@/models/ckan";

export class UserAdapter {
  static toUser(user: UserResponse): User {
    return {
      id: user.id,
      name: user.name,
      fullName: user.fullname,
      created: user.created,
      about: user.about,
      lastActive: user.last_active,
      activityStreamsEmailNotifications: user.activity_streams_email_notifications,
      sysadmin: user.sysadmin,
      state: user.state,
      imageUrl: user.image_url,
      displayName: user.display_name,
      emailHash: user.email_hash,
      numberCreatedPackages: user.number_created_packages,
      apiKey: user.apikey,
      email: user.email,
      imageDisplayUrl: user.image_display_url,
    };
  }
}
