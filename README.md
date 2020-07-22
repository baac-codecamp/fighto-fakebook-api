#  Local-Guide-API
     คือ API ที่ใช้สำหรับบันทึกข้อมูลผู้ใช้งานระบบ Local Guide โดยรับข้อมูลาจาก Local-Guide-GUI

## 📦 Built With
- [X] nodeJS

## 📋 Feature
- 

### API USER
- API index [GET] /api/user/
- API getUserById [GET] /api/user/:id
- API signup [POST] /api/user/
- API updateUser [PUT] /api/user/:id
- API [PATCH] /api/user/:id
- API deleteUser [DELETE] /api/user/:id
- API addReview [POST] /api/user/review/:id

### API GUIDE
- API index [GET] /api/guide/
- API getUserById [GET] /api/guide/:id
- API signup [POST] /api/guide/
- API updateUser [PUT] /api/guide/:id
- API [PATCH] /api/guide/:id
- API deleteUser [DELETE] /api/guide/:id
- API viewReview [GET] /api/guide/review/:id

### API CHECK
- API [GET] /health

## ⚙ How to use
-


## ER Diagram
<img src="./public/LocalGuide_ERD.jpg" width="60%">


## 🏷 Version

### version 0.1.3
- update Source Code form example

### version 0.1.2
- update ER Diagram

### version 0.1.1
- init project