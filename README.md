# WorkHive - Fullstack Saas for managing organizations of any size

# Technical documentation :

## Tech stack :
- React 
- Next.JS
- TailwindCSS
- Zustand
- Zod
- React hook form
- Postgres with neon
- Prisma as ORM
- Jwt
- Stripe

## Routes :
- For landing page `/`
- Login page `/login`
- Signup page `/signup`
- organization joining form `/join-org`

### notes :
- Checkout payment webhook . Suspected a major level bug in the webhook route handling account creation .
- Create manager creation logic 
- Separate the routes of joined and owned organizations

test organizations:
abcbpo@gmail.com  jhDJ74@#

### Test accounts:

amir465affan@gmail.com (jsDF34#$)
ahmedabbasi903@gmail.com (jhFG@#23)
aqiba.li82@gmail.com (jhFG76@#)
aliabbasi@gmail.com (djDF56@#)
affan.farooqsbf@gmail.com (dhFG@#87)

## Achieved:

### **Progress**:
- Implement the organization join functionality (completed)
- Setup a new table for tasks in neon (completed)
- setup a new table for notifications

### **Features checklist**:

| Feature                                 | Status | tested |
| --------------------------------------- | ------ | ------ |
| Multi-auth system (login/signup)        | ✅     | ⬜    |
| Payments w/ Stripe                      | ✅     | ⬜    |
| Multi-org creation & management         | ✅     | ⬜    |
| Department system                       | ✅     | ⬜    |
| Invite system                           | ✅     | ⬜    |
| Task assignment to employees            | ✅     | ⬜    |
| Employee dashboard with task view       | ✅     | ⬜    |
| Task status update (done / in progress) | ✅     | ⬜    |
| Invitation and onboarding               | ✅     | ⬜    |
| 🔔 Notifications system ✅             | ✅     | ⬜    |
| Analytics dashboard                     | ⬜     | ⬜    |
| Notifications system                    | ✅     | ⬜    |
| Comments / collaboration                | ⬜     | ⬜    |
| Task relation like a related to b       | ⬜     | ⬜    |
| Manager creation feature                | ⬜     | ⬜    |
| Sicial login                            | ⬜     | ⬜    |
| Mobile responsive / PWA                 | ✅     | ⬜    |
| Role-based access control               | ⬜     | ⬜    |
| Live demo hosted                        | ⬜     | ⬜    |
| GitHub README with screenshots          | ⬜     | ⬜    |
| Blog/case study write-up                | ⬜     | ⬜    |