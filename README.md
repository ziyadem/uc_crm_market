#crm_backend_uc

https://docs.google.com/document/d/1CeWZKra4KY5oEUgys5Ky6_RpDV96ey-0eCbmeWQxOdo/edit?usp=sharing

https://docs.google.com/document/d/1CeWZKra4KY5oEUgys5Ky6_RpDV96ey-0eCbmeWQxOdo/edit


# super admin
 $2b$12$a2GDf4iuGHPNy05KV0PExONlFxrAACd.xrWbN/iM92LWbEUhXy/YO
 uc_coding


# BACKEND RUN

1. npm i --force
2. postgresdan database ochiladi.Databasaning nomi ixtiyoriy faqat .env ning ichidagi DATABASE_URL to'g'ri ulanishi kerak.
3. npx prisma migrate dev
4. npx prisma generate
5. Supper Admin uchun role yaratiladi.Postgres shell terminaliga kiriladi quyidagicha code yoziladi: insert into roles(id, name ) values('83b2b51e-6ccc-45d1-961c-420a68bf1ea4', 'super admin');
6. Super Admin yaratiladi.Postgres shell terminaliga kiriladi quyidagicha code yoziladi: insert into users(id, login, password, role_id , telegram_id, created_at, updated_at) values('83b2b51e-6ccc-45d1-961c-420a68bf1ea4', 'uc_coding', '$2b$12$a2GDf4iuGHPNy05KV0PExONlFxrAACd.xrWbN/iM92LWbEUhXy/YO', '83b2b51e-6ccc-45d1-961c-420a68bf1ea4', '5359005467', '2023-11-14T10:29:39.203Z', '2023-11-14T10:29:39.203Z');
7. npm run dev

# FRONTEND RUN

1. npm i --force
2. .env filega VITE_API_KEY='http://localhost:7777' yaratiladi.
3. npm run dev