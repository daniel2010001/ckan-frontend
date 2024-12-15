import { User, UserRegister, UserResponse } from "@/models/ckan";
import { StateAdapter } from "./state.adapter";

export class UserAdapter {
  static toUserRequest(user: any): UserRegister {
    return {
      name: user.username,
      email: user.email,
      password: user.password,
      fullname: user.fullName,
      about: user.about,
      image_url: user.imageUrl,
      profile_picture: user.profilePicture,
    };
  }

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
      isActive: StateAdapter.isActive(user.state),
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
