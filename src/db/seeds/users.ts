import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            phone: '917845612309',
            name: 'Rahul Sharma',
            gender: 'Male',
            age: 24,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=1',
            createdAt: new Date('2024-08-15').toISOString(),
        },
        {
            phone: '918923456712',
            name: 'Priya Patel',
            gender: 'Female',
            age: 26,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=2',
            createdAt: new Date('2024-09-01').toISOString(),
        },
        {
            phone: '919012345678',
            name: 'Amit Kumar',
            gender: 'Male',
            age: 22,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=3',
            createdAt: new Date('2024-09-10').toISOString(),
        },
        {
            phone: '917734567890',
            name: 'Sneha Gupta',
            gender: 'Female',
            age: 28,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=4',
            createdAt: new Date('2024-09-20').toISOString(),
        },
        {
            phone: '918845671234',
            name: 'Arjun Singh',
            gender: 'Male',
            age: 23,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=5',
            createdAt: new Date('2024-10-05').toISOString(),
        },
        {
            phone: '919156782345',
            name: 'Ananya Reddy',
            gender: 'Female',
            age: 25,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=6',
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            phone: '917923456789',
            name: 'Rohan Desai',
            gender: 'Male',
            age: 21,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=7',
            createdAt: new Date('2024-10-25').toISOString(),
        },
        {
            phone: '918834567812',
            name: 'Meera Iyer',
            gender: 'Female',
            age: 29,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=8',
            createdAt: new Date('2024-11-01').toISOString(),
        },
        {
            phone: '919045678923',
            name: 'Karthik Krishnan',
            gender: 'Male',
            age: 27,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=9',
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            phone: '917756789034',
            name: 'Deepa Nair',
            gender: 'Female',
            age: 24,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=10',
            createdAt: new Date('2024-11-18').toISOString(),
        },
        {
            phone: '918867890145',
            name: 'Vikram Malhotra',
            gender: 'Male',
            age: 30,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=11',
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            phone: '919178901256',
            name: 'Pooja Yadav',
            gender: 'Female',
            age: 22,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=12',
            createdAt: new Date('2024-12-01').toISOString(),
        },
        {
            phone: '917689012367',
            name: 'Aditya Verma',
            gender: 'Other',
            age: 26,
            occupation: 'Professional',
            profilePhoto: 'https://i.pravatar.cc/150?img=13',
            createdAt: new Date('2024-12-08').toISOString(),
        },
        {
            phone: '918890123478',
            name: 'Ritu Jain',
            gender: 'Other',
            age: 23,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=14',
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            phone: '919001234589',
            name: 'Suresh Pillai',
            gender: 'Other',
            age: 35,
            occupation: 'Student',
            profilePhoto: 'https://i.pravatar.cc/150?img=15',
            createdAt: new Date('2024-12-20').toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});