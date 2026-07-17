// import crypto from 'crypto';
// import { supabase } from './supabase';

// // Função para gerar hash da senha
// export function hashPassword(password: string): string {
//   return crypto.createHash('sha256').update(password).digest('hex');
// }

// // Função para verificar se senha já foi usada anteriormente
// export async function isPasswordReused(userId: string, newPassword: string): Promise<boolean> {
//   const newPasswordHash = hashPassword(newPassword);
  
//   const { data: previousPasswords, error } = await supabase
//     .from('password_history')
//     .select('password_hash')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false })
//     .limit(5); // Verifica últimas 5 senhas
  
//   if (error || !previousPasswords) return false;
  
//   return previousPasswords.some(p => p.password_hash === newPasswordHash);
// }

// // Função para salvar senha no histórico
// export async function savePasswordToHistory(userId: string, passwordHash: string) {
//   await supabase
//     .from('password_history')
//     .insert({
//       user_id: userId,
//       password_hash: passwordHash,
//     });
// }

// // Função para limpar histórico antigo (mantém últimas 10)
// export async function cleanupOldPasswords(userId: string) {
//   const { data: passwords } = await supabase
//     .from('password_history')
//     .select('id')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false })
//     .range(10, 1000); // Mantém só as 10 mais recentes
  
//   if (passwords && passwords.length > 0) {
//     const idsToDelete = passwords.map(p => p.id);
//     await supabase
//       .from('password_history')
//       .delete()
//       .in('id', idsToDelete);
//   }
// }