# Claude Trading Skills — instalação local

Repo: `claude-trading-skills/` (clonado de https://github.com/tradermonty/claude-trading-skills)

## O que foi instalado

- `uv` 0.13.9 em `C:\Users\DELL\.local\bin` (gerenciador Python; **adicione essa pasta ao PATH** ou use os comandos abaixo).
- Ambiente Python travado em `claude-trading-skills/.venv` via `uv sync --locked`.
- 74 skills registradas no OpenCode em `claude-trading-skills/opencode.json` (`skills: ["./skills"]`).
- Pastas de trabalho criadas: `reports/first-week/`, `state/first-week-theses/`, `first-week-inputs/`.

## Como usar no OpenCode

Abra uma sessão dentro de `claude-trading-skills/`. As skills aparecem automaticamente;
chame pelo ID, ex.: `market-breadth-analyzer`, `exposure-coach`, `trader-memory-core`.

## Como executar direto (PowerShell)

Sempre comece com:

```powershell
$env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
cd C:\Users\DELL\Videos\trade\claude-trading-skills
```

Cheque diário sem API paga (15 min):

```powershell
uv run python skills\market-breadth-analyzer\scripts\market_breadth_analyzer.py --output-dir reports\first-week
uv run python skills\uptrend-analyzer\scripts\uptrend_analyzer.py --output-dir reports\first-week
```

Depois rode `exposure-coach` passando os dois JSONs gerados (ver `docs/en/your-first-week.md`, Dia 3).

## WIN / WDO (mercado brasileiro)

O Yahoo Finance **não** tem os contratos da B3. A fonte usada é a API gratuita da
**brapi.dev**, que libera WIN e WDO **sem token**. Já instalei `requests` no ambiente
(ele já vinha do `uv sync`) e criei `analise_win.py` na raiz.

```powershell
& "C:\Users\DELL\Videos\trade\claude-trading-skills\.venv\Scripts\python.exe" C:\Users\DELL\Videos\trade\analise_win.py
```

O script escolhe automaticamente o vencimento front month (ex.: `WINZ26`, `WDOZ26`) e
mostra ajuste diário, variação, SMAs e RSI. Limitação: a brapi não fornece `open`
da vela diária, então a direção é calculada contra o ajuste do dia anterior.

Para **OHLC completo intraday / tempo real**, aí sim é necessário instalar o
**MetaTrader 5** de uma corretora com WIN/WDO (a skill `mt5-robot-tester` do repo já
suporta). Tentei também TradingView (`tradingview-datafeed`), mas a conexão de dados
falhou (timeout) neste ambiente.

## Relatório PDF do WIN/WDO

O envio por e-mail foi cancelado (tarefa e credenciais removidas). Para gerar o PDF:

```powershell
& "C:\Users\DELL\Videos\trade\claude-trading-skills\.venv\Scripts\python.exe" C:\Users\DELL\Videos\trade\gerar_pdf.py
```

Saída: `C:\Users\DELL\Videos\trade\relatorio_win_wdo.pdf` (mais recente) e uma cópia
com data/hora no nome, ex.: `relatorio_win_wdo_2026-11-18_012310.pdf`.

Tarefa agendada: **"Trading WIN-WDO PDF Diario"**, todos os dias às **23:59**:
```powershell
schtasks /Run /TN "Trading WIN-WDO PDF Diario"      # executar agora
schtasks /Query /TN "Trading WIN-WDO PDF Diario"    # conferir
schtasks /Delete /TN "Trading WIN-WDO PDF Diario"   # remover
```
Log: `gerar_pdf.log`. O `.bat` usa `cd /d` porque o agendador inicia em `System32`.

> O relatório usa o último ajuste disponível (dia anterior), já que a brapi publica
> dados de fim de dia. Não há abertura de vela nem dados intraday nessa fonte.

## Aviso

Ferramenta de análise, journaling e gestão de risco. **Não** executa ordens nem dá sinais
de compra/venda. Decisões e risco são seus.

Guia completo: `claude-trading-skills/docs/en/your-first-week.md`
