import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { PortData } from '../types/port';
import { setCachedPorts } from '../services/cacheService';

export async function bulkUpsertPorts(ports: PortData[], countryCode: string) {
  try {
    const upsertOperations = ports.map(port => ({
      where: { locode: port.locode },
      update: {
        name: port.name,
        nameWoDiacritics: port.nameWoDiacritics,
        function: port.function,
        status: port.status,
        subdivision: port.subdivision,
        iata: port.iata,
        remarks: port.remarks,
        unlocodeDate: port.date,
        updatedAt: new Date()
      },
      create: {
        locode: port.locode,
        name: port.name,
        nameWoDiacritics: port.nameWoDiacritics,
        countryCode: countryCode.toUpperCase(),
        function: port.function,
        status: port.status,
        subdivision: port.subdivision,
        iata: port.iata,
        remarks: port.remarks,
        unlocodeDate: port.date,
        latitude: 0, // These will be updated later
        longitude: 0
      }
    }));

    await prisma.$transaction(
      upsertOperations.map(op => 
        prisma.port.upsert(op)
      )
    );

    logger.info(`Bulk upserted ${ports.length} ports for country ${countryCode}`);
    setCachedPorts(countryCode, ports);
  } catch (error) {
    logger.error('Bulk upsert failed:', { error });
    throw error;
  }
} 