-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "plazo" INTEGER NOT NULL,
    "cuota_mensual" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);
