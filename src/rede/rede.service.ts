import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RedeService {
  private supabase;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) throw new Error('SUPABASE_URL ou SUPABASE_KEY não definidos');
    this.supabase = createClient(url, key);
  }

  async montarRede(profileId: string, nivel = 1, maxNivel = 5, contador?: Map<number, number>): Promise<any[]> {
    if (nivel > maxNivel) return [];

    const { data, error } = await this.supabase
      .from('profiles')
      .select('id, first_name, email, created_at')
      .eq('referred_by', profileId);

    if (error) throw new Error(error.message);

    if (!contador) contador = new Map();

    if (!contador.has(nivel)) contador.set(nivel, 0);
    contador.set(nivel, contador.get(nivel)! + data.length);

    const resultado = await Promise.all(
      data.map(async (usuario) => ({
        id: usuario.id,
        first_name: usuario.first_name,
        email: usuario.email,
        created_at: usuario.created_at,
        nivel,
        indicados: await this.montarRede(usuario.id, nivel + 1, maxNivel, contador),
      })),
    );

    return resultado;
  }

  async montarRedeComTotais(profileId: string) {
    const contador = new Map<number, number>();
    const rede = await this.montarRede(profileId, 1, 5, contador);

    const totais_por_nivel = {};
    for (const [nivel, total] of contador.entries()) {
      totais_por_nivel[nivel] = total;
    }

    return {
      profile_id: profileId,
      rede,
      totais_por_nivel,
    };
  }
}
