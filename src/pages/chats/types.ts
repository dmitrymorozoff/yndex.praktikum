export type Chat = {
  id: number,
  title: string,
  avatar: string,
  unreadCount: number,
  lastMessage: {
    user: {
      firstName: string
      secondName: string
      avatar: string
      email: string
      login: string
      phone: string
    },
    time: Date,
    content: string
  }
}

export type RawChat = {
  id: number,
  title: string,
  avatar: string,
  unread_count: number,
  last_message: {
    user: {
      first_name: string,
      second_name: string,
      avatar: string,
      email: string,
      login: string,
      phone: string
    },
    time: Date,
    content: string
  }
}
