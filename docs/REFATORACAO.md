# Refatoração e Padrões Aplicados

Este documento descreve problemas identificados, proposta de refatoração e mudanças implementadas para melhorar reutilização, legibilidade e evolução do projeto.

## Análise inicial (pontos críticos)

- Duplicação de lógica utilitária:
  - Funções de formatação de preço e data repetidas em `lanches.js`, `pedidos.js`, `receitas.js`, `caixas.js`.
- Regras de negócio acopladas às rotas (Ex.: concluir pedido também grava receita):
  - Dificulta testes e evolução; responsabilidades misturadas.
- Falta de abstrações para parsing de payloads complexos (strings concatenadas para descrição/extra de pedidos).
- Dependência rígida entre módulos (rotas manipulando diretamente modelos e efeitos colaterais sem eventos).
- Uso de valores mágicos (offset de fuso horário, tipo de receita, etc.).

## Proposta de refatoração (GoF)

Foram selecionados e aplicados os seguintes padrões:

1. Adapter
   - Arquivo `utils/pedidoParser.js` converte as strings de formulário (ex.: "1\\X-Burger\\Pão\\12.00\\2\\Observação") em objetos de domínio para `Pedido`.
   - Benefício: isola detalhes de formato e evita duplicação/erros nas rotas.

2. Template Method (+ Factory Method)
   - Serviço `services/orderService.js` encapsula o fluxo de conclusão de um pedido com hooks `beforeConclude/afterConclude` e o método-fábrica `createReceitaFromOrder`.
   - Benefício: padroniza o processo, facilita extensões (por exemplo, integrar pagamento ou faturamento) e testes.

3. Observer
   - `events/eventBus.js` emite evento `order.concluded` quando um pedido é concluído.
   - Benefício: desacopla side effects (ex.: analytics, notificações) do fluxo principal.

4. Facade (utilidades compartilhadas)
   - `utils/formatters.js` centraliza formatação de data/preço e ajuste de fuso.
   - Benefício: ponto único para utilidades comuns; reduz duplicação.

Obs.: Também foi criado um módulo de Factory simples (`services/factory.js`) para futuras criações de objetos de domínio caso necessário.

## Implementação (arquivos criados/alterados)

- Criados:
  - `utils/formatters.js` (Facade utilitária: `maskPrice`, `maskDateDDMMYYYY`, `adjustTimezone`).
  - `utils/pedidoParser.js` (Adapter para descrição/extras de pedidos).
  - `events/eventBus.js` (Observer via EventEmitter).
  - `services/orderService.js` (Template Method para concluir pedido + emissão de evento + Factory Method para receita).
  - `services/factory.js` (Factory simples para objetos de domínio).
  - `docs/REFATORACAO.md` (este documento).

- Alterados:
  - `routes/lanches.js`: passou a usar `maskPrice` removendo `mascaraDePreco` duplicada.
  - `routes/pedidos.js`: removeu helpers duplicados, passou a usar `formatters`, `pedidoParser` e delegou conclusão para `orderService`.
  - `routes/receitas.js`: removeu helpers duplicados, usou `formatters`.
  - `routes/caixas.js`: removeu helpers duplicados, usou `formatters`.

## Próximos passos sugeridos

- Estruturar camadas (controllers, services, repositories) explicitamente.
- Adicionar testes unitários para `pedidoParser`, `formatters` e `orderService`.
- Externalizar `timezoneOffset` para config/variáveis de ambiente.
- Introduzir DTOs/validação com `joi` ou `zod` para entradas das rotas.
- Migrar de callbacks para async/await onde ainda necessário e padronizar `lean()`/`toObject()`.
- Reavaliar campos como `Usuario.admin` (usar boolean) e normalização de dados.
