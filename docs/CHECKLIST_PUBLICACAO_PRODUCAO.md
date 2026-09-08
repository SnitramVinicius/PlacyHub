# Checklist de publicação da PlacyHub

## Obrigatório antes de aceitar reservas reais

- [ ] Aplicar, em ordem, todas as migrações de `supabase/migrations`.
- [ ] Confirmar que a migração `20260906_seguranca_reservas_e_perfis.sql`
      terminou sem conflitos de reservas existentes.
- [ ] Configurar no ambiente de produção: `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
      `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_APPLICATION_ID`,
      `RESEND_API_KEY` e `NEXT_PUBLIC_BASE_URL` com HTTPS.
- [ ] Remover do ambiente publicado as variáveis legadas `JWT_SECRET`,
      `DATABASE_URL` e `MERCADOPAGO_TOKEN` se nenhum outro serviço externo
      depender delas. O token utilizado atualmente é `MP_ACCESS_TOKEN`.
- [ ] No Mercado Pago, cadastrar exatamente
      `https://DOMINIO/api/webhook/mercadopago` e conferir o segredo da assinatura.
- [ ] Trocar o remetente de teste `onboarding@resend.dev` por um domínio verificado.
- [ ] Conferir no Supabase que RLS está habilitado em todas as tabelas públicas e
      que usuários só leem/escrevem registros próprios.
- [ ] Validar URLs autorizadas de redirecionamento do Supabase para o domínio real.

## Teste final em produção/homologação

- [ ] Cadastro por e-mail e confirmação de e-mail.
- [ ] Login por e-mail, Google e Facebook.
- [ ] Recuperação e alteração de senha.
- [ ] Cadastro e edição de espaço, fotos, regras e preços.
- [ ] Reserva de espaço normal e de pacote/buffet.
- [ ] Tentativa simultânea da mesma data em duas contas (uma deve falhar).
- [ ] Pagamento aprovado, recusado, pendente, expirado, duplicado e estornado.
- [ ] Recebimento do webhook, notificações e e-mails de ambas as partes.
- [ ] Cancelamento, reagendamento, avaliação e repasse.
- [ ] Conferência manual dos valores em centavos de pacotes já cadastrados.

## Verificação local automatizada

```bash
npm run typecheck
npm run security:audit
npm run build
```

O lançamento deve ocorrer somente se os três comandos e os testes de integração
acima terminarem com sucesso.
