export type BlogInputModel = {
  name:	string, //maxLength: 15
  description: string, //maxLength: 500
  websiteUrl:	string //maxLength: 100; pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export type BlogPostInputModel = {
  title: string,  //maxLength: 30
  shortDescription:	string, //maxLength: 100
  content:	string //maxLength: 1000
}