export interface Taxi {
  id: string;
  number: string;
  model: string;
  driverName: string;
  driverPhone: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  tripsCompleted: number;
  seats: number;
  hasAC: boolean;
  rating: number;
  image: string;
}

export interface Trip {
  id: string;
  taxiNumber: string;
  driverName: string;
  from: string;
  destination: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Running';
}

export const INITIAL_TAXIS: Taxi[] = [
  {
    id: 't1',
    number: 'Ba 2 Cha 1234',
    model: 'GAC Aion Y Plus',
    driverName: 'Ramesh Thapa',
    driverPhone: '+977 9857821001',
    status: 'Available',
    tripsCompleted: 142,
    seats: 5,
    hasAC: true,
    rating: 4.8,
    image: '/image/car 2.jpg',
  },
  {
    id: 't2',
    number: 'Ba 2 Cha 2345',
    model: 'GAC Aion Y Plus',
    driverName: 'Sita Shrestha',
    driverPhone: '+977 9857821002',
    status: 'On Trip',
    tripsCompleted: 98,
    seats: 5,
    hasAC: true,
    rating: 4.9,
    image: '/image/car 2.jpg',
  },
  {
    id: 't3',
    number: 'Ba 2 Cha 3456',
    model: 'GAC Aion Y Plus',
    driverName: 'Hari Bahadur',
    driverPhone: '+977 9857821003',
    status: 'Available',
    tripsCompleted: 215,
    seats: 5,
    hasAC: true,
    rating: 4.6,
    image: '/image/car 2.jpg',
  },
  {
    id: 't4',
    number: 'Ra 1 Cha 4567',
    model: 'GAC Aion Y Plus',
    driverName: 'Nabraj Oli',
    driverPhone: '+977 9857821004',
    status: 'Maintenance',
    tripsCompleted: 64,
    seats: 5,
    hasAC: true,
    rating: 4.7,
    image: '/image/car 2.jpg',
  },
  {
    id: 't5',
    number: 'Ra 1 Cha 5678',
    model: 'GAC Aion Y Plus',
    driverName: 'Gita Chaudhary',
    driverPhone: '+977 9857821005',
    status: 'Available',
    tripsCompleted: 110,
    seats: 5,
    hasAC: true,
    rating: 4.9,
    image: '/image/car 2.jpg',
  },
  {
    id: 't6',
    number: 'Ba 3 Cha 6789',
    model: 'GAC Aion Y Plus',
    driverName: 'Sunil Sen',
    driverPhone: '+977 9857821006',
    status: 'On Trip',
    tripsCompleted: 180,
    seats: 5,
    hasAC: true,
    rating: 4.5,
    image: '/image/car 2.jpg',
  },
  {
    id: 't7',
    number: 'Ba 3 Cha 7890',
    model: 'GAC Aion Y Plus',
    driverName: 'Deepa Rijal',
    driverPhone: '+977 9857821007',
    status: 'Available',
    tripsCompleted: 75,
    seats: 5,
    hasAC: true,
    rating: 4.8,
    image: '/image/car 2.jpg',
  },
  {
    id: 't8',
    number: 'Ra 2 Cha 8901',
    model: 'GAC Aion Y Plus',
    driverName: 'Prakash KC',
    driverPhone: '+977 9857821008',
    status: 'Available',
    tripsCompleted: 153,
    seats: 5,
    hasAC: true,
    rating: 4.7,
    image: '/image/car 2.jpg',
  },
  {
    id: 't9',
    number: 'Ba 2 Cha 9012',
    model: 'GAC Aion Y Plus',
    driverName: 'Mina Sharma',
    driverPhone: '+977 9857821009',
    status: 'On Trip',
    tripsCompleted: 120,
    seats: 5,
    hasAC: true,
    rating: 4.8,
    image: '/image/car 2.jpg',
  },
  {
    id: 't10',
    number: 'Ra 1 Cha 0123',
    model: 'GAC Aion Y Plus',
    driverName: 'Bikash Gurung',
    driverPhone: '+977 9857821010',
    status: 'Available',
    tripsCompleted: 95,
    seats: 5,
    hasAC: true,
    rating: 4.6,
    image: '/image/car 2.jpg',
  },
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'tr-1',
    taxiNumber: 'Ba 2 Cha 1234',
    driverName: 'Ramesh Thapa',
    from: 'Dang',
    destination: 'Kathmandu',
    amount: 15000,
    date: '2026-07-20',
    status: 'Completed',
  },
  {
    id: 'tr-2',
    taxiNumber: 'Ba 2 Cha 2345',
    driverName: 'Sita Shrestha',
    from: 'Dang',
    destination: 'Pokhara',
    amount: 12000,
    date: '2026-07-21',
    status: 'Running',
  },
  {
    id: 'tr-3',
    taxiNumber: 'Ba 2 Cha 3456',
    driverName: 'Hari Bahadur',
    from: 'Dang',
    destination: 'Butwal',
    amount: 6000,
    date: '2026-07-19',
    status: 'Completed',
  },
  {
    id: 'tr-4',
    taxiNumber: 'Ba 3 Cha 6789',
    driverName: 'Sunil Sen',
    from: 'Dang',
    destination: 'Nepalgunj',
    amount: 4500,
    date: '2026-07-21',
    status: 'Running',
  },
  {
    id: 'tr-5',
    taxiNumber: 'Ra 2 Cha 8901',
    driverName: 'Prakash KC',
    from: 'Dang',
    destination: 'Kathmandu',
    amount: 16000,
    date: '2026-07-18',
    status: 'Completed',
  },
];