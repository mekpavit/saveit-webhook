export type Message =
  | TextMessage
  | ImageMessage

export type TextMessage = {
  type: "text",
  text: string
}

export type ImageMessage = {
  type: "image",
  imageUrl: string
}