const mongoose = require('mongoose');
const Event = require('../models/Event');

const sampleEvents = [
  {
    title: 'Tech Workshop 2024',
    description: 'Join us for an exciting workshop on the latest technologies and trends in software development.',
    club: 'Computer Science Club',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'upcoming',
    startDate: new Date('2024-04-15T10:00:00Z'),
    endDate: new Date('2024-04-15T16:00:00Z'),
    location: 'Engineering Building Room 101',
    capacity: 50,
    registrationDeadline: new Date('2024-04-10T23:59:59Z')
  },
  {
    title: 'Cultural Festival',
    description: 'Experience diverse cultures through music, dance, and food from around the world.',
    club: 'Cultural Society',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'upcoming',
    startDate: new Date('2024-05-01T12:00:00Z'),
    endDate: new Date('2024-05-01T20:00:00Z'),
    location: 'Main Campus Quad',
    capacity: 200,
    registrationDeadline: new Date('2024-04-25T23:59:59Z')
  },
  {
    title: 'Career Fair 2024',
    description: 'Connect with top employers and explore internship and job opportunities.',
    club: 'Career Services',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'upcoming',
    startDate: new Date('2024-04-20T09:00:00Z'),
    endDate: new Date('2024-04-20T17:00:00Z'),
    location: 'Student Center Ballroom',
    capacity: 300,
    registrationDeadline: new Date('2024-04-15T23:59:59Z')
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/eventra');
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log('Added sample events');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents(); 