# transport_crm

mutation register >
request => foydalanuvchi nomi, parol, tugilgan yili, jinsi va filial(filial nomi yozilishi kerak misol: Toshkent, Andijon) 
response => status: 200, success: true, message:"successfully", data: "JSON parse qilinadi" 

query ownPermissions >
request => headers ichida token berilishi kerak, token ro'yhatdan o'tganda yoki login qilinganda datani ichida keladi
response => status: 200, success: true, message:"successfully", data: { userid, username, birthda, brench, gender }

biror foydalanuvchi uchun barcha permissinlarni olish
request => http://207.154.196.81:5000/root/1 1 o'rnida o'zingizga kerakli useridni yozib jonatasiz useridni ownPermissionda keladi
response => [ {userId: 1},{userId: 1},{userId: 1}] => Barcha permissionlardan ruhsat berildi

Filial (f) o'chirib yuborilganda f. ishchisi va f. dagi transportlar ham birga o'chirib yuboriladi.
Ishchi (i) o'chirib yuborilganda i. tomonidan qo'shilgan transportlar birga o'chirib yuboriladi.
Transport (t) o'chiriib yuborilganda shunchaki o'chib ketadi ).

permissionlar ishlash tartibi:

                              create                                    read                           update                                   delete
transport    (+) t qo'sha oladi o'zini filialida            (+) hamma t. larni ko'ra oladi                                       (-) t o'chira oladi o'zini filialida
                               
                
                
branch      
permission
