import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { EstadoSolicitud, PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
async function main() {
  console.log('🌱 Iniciando la carga de datos iniciales (Seeding)...');

  // Limpiar datos existentes para evitar duplicados en re-ejecuciones
  await prisma.solicitud.deleteMany();

  const solicitudes = [
    {
      nombres: 'Juan Carlos',
      apellidos: 'Pérez Gómez',
      dni: '72839401',
      correo: 'juan.perez@email.com',
      telefono: '987654321',
      monto: 3500.00,
      plazo: 12,
      cuotaMensual: 331.40,
      estado: EstadoSolicitud.pendiente,
    },
    {
      nombres: 'Maria Elena',
      apellidos: 'Rodríguez Silva',
      dni: '45920183',
      correo: 'maria.rodriguez@email.com',
      telefono: '912345678',
      monto: 5000.00,
      plazo: 18,
      cuotaMensual: 334.82,
      estado: EstadoSolicitud.aprobada,
    },
    {
      nombres: 'Luis Alberto',
      apellidos: 'Mendoza Quispe',
      dni: '10293847',
      correo: 'luis.mendoza@email.com',
      telefono: '954321876',
      monto: 2000.00,
      plazo: 6,
      cuotaMensual: 357.21,
      estado: EstadoSolicitud.rechazada,
    },
  ];

  for (const data of solicitudes) {
    const solicitud = await prisma.solicitud.create({
      data,
    });
    console.log(`✅ Solicitud creada para: ${solicitud.nombres} ${solicitud.apellidos} (ID: ${solicitud.id})`);
  }

  console.log('🚀 Seeding finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });