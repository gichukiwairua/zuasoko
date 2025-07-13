import {
  PrismaClient,
  UserRole,
  AccountStatus,
  DriverStatus,
} from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.create({
    data: {
      email: "admin@zuasoko.com",
      phone: "254712345678",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
      admin: {
        create: {
          canApproveDrivers: true,
          canManageUsers: true,
          canViewAnalytics: true,
        },
      },
    },
  });

  console.log("✅ Admin user created");

  // Create farmer agent
  const agentPassword = await hashPassword("agent123");
  const farmerAgent = await prisma.user.create({
    data: {
      email: "agent@zuasoko.com",
      phone: "254723456789",
      password: agentPassword,
      firstName: "John",
      lastName: "Agent",
      role: UserRole.FARMER_AGENT,
      status: AccountStatus.ACTIVE,
      farmerAgent: {
        create: {
          assignedCounty: "Kiambu",
          onboardingQuota: 50,
        },
      },
    },
    include: {
      farmerAgent: true,
    },
  });

  console.log("✅ Farmer agent created");

  // Create farmers
  const farmer1Password = await hashPassword("farmer123");
  const farmer1 = await prisma.user.create({
    data: {
      email: "farmer1@zuasoko.com",
      phone: "254734567890",
      password: farmer1Password,
      firstName: "Jane",
      lastName: "Farmer",
      role: UserRole.FARMER,
      status: AccountStatus.ACTIVE,
      farmer: {
        create: {
          farmName: "Green Valley Farm",
          county: "Kiambu",
          subCounty: "Kikuyu",
          farmSize: 5.5,
          kraPin: "A123456789K",
          latitude: -1.2921,
          longitude: 36.8219,
          subscriptionPaid: true,
          subscriptionDate: new Date(),
          farmerAgentId: farmerAgent.farmerAgent?.id,
        },
      },
    },
    include: {
      farmer: true,
    },
  });

  const farmer2Password = await hashPassword("farmer123");
  const farmer2 = await prisma.user.create({
    data: {
      phone: "254745678901",
      password: farmer2Password,
      firstName: "Peter",
      lastName: "Mwangi",
      role: UserRole.FARMER,
      status: AccountStatus.ACTIVE,
      farmer: {
        create: {
          farmName: "Sunrise Organic Farm",
          county: "Nakuru",
          farmSize: 10.0,
          latitude: -0.3031,
          longitude: 36.08,
          subscriptionPaid: true,
          subscriptionDate: new Date(),
        },
      },
    },
    include: {
      farmer: true,
    },
  });

  console.log("✅ Farmers created");

  // Create customers
  const customer1Password = await hashPassword("customer123");
  const customer1 = await prisma.user.create({
    data: {
      email: "customer1@example.com",
      phone: "254756789012",
      password: customer1Password,
      firstName: "Mary",
      lastName: "Customer",
      role: UserRole.CUSTOMER,
      status: AccountStatus.ACTIVE,
      customer: {
        create: {
          county: "Nairobi",
          latitude: -1.2921,
          longitude: 36.8219,
          loyaltyPoints: 150,
        },
      },
    },
    include: {
      customer: true,
    },
  });

  const customer2Password = await hashPassword("customer123");
  const customer2 = await prisma.user.create({
    data: {
      phone: "254767890123",
      password: customer2Password,
      firstName: "David",
      lastName: "Buyer",
      role: UserRole.CUSTOMER,
      status: AccountStatus.ACTIVE,
      customer: {
        create: {
          county: "Mombasa",
          latitude: -4.0435,
          longitude: 39.6682,
        },
      },
    },
    include: {
      customer: true,
    },
  });

  console.log("✅ Customers created");

  // Create drivers
  const driver1Password = await hashPassword("driver123");
  const driver1 = await prisma.user.create({
    data: {
      phone: "254778901234",
      password: driver1Password,
      firstName: "Michael",
      lastName: "Driver",
      role: UserRole.DRIVER,
      status: AccountStatus.ACTIVE,
      driver: {
        create: {
          licenseNumber: "DL001234567",
          vehicleType: "Pickup Truck",
          vehicleRegNo: "KCA123A",
          idNumber: "12345678",
          status: DriverStatus.APPROVED,
          approvedAt: new Date(),
          approvedBy: admin.id,
          isAvailable: true,
          totalDeliveries: 25,
          rating: 4.7,
        },
      },
    },
  });

  console.log("✅ Drivers created");

  // Create produce
  const produces = [
    {
      name: "Organic Tomatoes",
      category: "Vegetables",
      quantity: 100,
      unit: "kg",
      pricePerUnit: 120,
      description: "Fresh organic tomatoes, vine-ripened and pesticide-free",
      stockQuantity: 100,
      isApproved: true,
      isFeatured: true,
      slug: "organic-tomatoes",
      tags: ["organic", "fresh", "vegetables", "tomatoes"],
      farmerId: farmer1.farmer?.id!,
      harvestDate: new Date(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      name: "Sweet Potatoes",
      category: "Root Vegetables",
      quantity: 50,
      unit: "kg",
      pricePerUnit: 80,
      description: "Nutritious orange-fleshed sweet potatoes",
      stockQuantity: 50,
      isApproved: true,
      slug: "sweet-potatoes",
      tags: ["sweet-potatoes", "nutritious", "root-vegetables"],
      farmerId: farmer1.farmer?.id!,
      harvestDate: new Date(),
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
    {
      name: "Fresh Spinach",
      category: "Leafy Greens",
      quantity: 30,
      unit: "bunches",
      pricePerUnit: 50,
      description: "Crisp and fresh spinach leaves, rich in iron",
      stockQuantity: 30,
      isApproved: true,
      isFeatured: true,
      slug: "fresh-spinach",
      tags: ["spinach", "leafy-greens", "iron-rich"],
      farmerId: farmer2.farmer?.id!,
      harvestDate: new Date(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
    {
      name: "Carrots",
      category: "Root Vegetables",
      quantity: 75,
      unit: "kg",
      pricePerUnit: 90,
      description: "Fresh orange carrots, perfect for cooking and snacking",
      stockQuantity: 75,
      isApproved: true,
      slug: "fresh-carrots",
      tags: ["carrots", "root-vegetables", "vitamin-a"],
      farmerId: farmer2.farmer?.id!,
      harvestDate: new Date(),
      expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    },
  ];

  const createdProduces = [];
  for (const produce of produces) {
    const created = await prisma.produce.create({
      data: produce,
    });
    createdProduces.push(created);
  }

  console.log("✅ Produce items created");

  // Create market prices
  const marketPrices = [
    {
      produce: "Tomatoes",
      county: "Kiambu",
      avgPrice: 110,
      minPrice: 90,
      maxPrice: 130,
      marketName: "Kiambu Market",
      reportDate: new Date(),
    },
    {
      produce: "Sweet Potatoes",
      county: "Nakuru",
      avgPrice: 75,
      minPrice: 60,
      maxPrice: 90,
      marketName: "Nakuru Market",
      reportDate: new Date(),
    },
  ];

  for (const price of marketPrices) {
    await prisma.marketPrice.create({
      data: price,
    });
  }

  console.log("✅ Market prices created");

  // Create weather alerts
  await prisma.weatherAlert.create({
    data: {
      county: "Kiambu",
      alertType: "RAIN",
      severity: "MEDIUM",
      message:
        "Moderate rainfall expected in the next 3 days. Good for planting.",
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Weather alerts created");

  // Create sample cart for customer1
  const cart = await prisma.cart.create({
    data: {
      customerId: customer1.customer?.id!,
      totalItems: 2,
      totalAmount: 270,
      items: {
        create: [
          {
            produceId: createdProduces[0].id,
            quantity: 2,
            pricePerUnit: 120,
            totalPrice: 240,
          },
          {
            produceId: createdProduces[2].id,
            quantity: 1,
            pricePerUnit: 50,
            totalPrice: 50,
          },
        ],
      },
    },
  });

  console.log("✅ Sample cart created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
