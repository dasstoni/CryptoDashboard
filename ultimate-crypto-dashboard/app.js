// Crypto Dashboard Application
class CryptoDashboard {
    constructor() {
        this.cryptoData = {
            "BTC": {
                "symbol": "BTC",
                "name": "Bitcoin",
                "currentPrice": 116750,
                "change24h": -2.3,
                "volume24h": 28500000000,
                "marketCap": 2305000000000,
                "rsi": 45.2,
                "macd": -850,
                "macdSignal": -920,
                "ma20": 118200,
                "ma50": 113400,
                "ma200": 105800,
                "wyckoffPhase": "Accumulation",
                "elliottWave": "Wave 4 Correction",
                "sentiment": "Neutral",
                "whaleActivity": "High accumulation",
                "exchangeFlow": "Net outflows: 2,400 BTC",
                "project": {
                    "description": "The first and largest cryptocurrency by market cap, created by Satoshi Nakamoto in 2009.",
                    "whitepaper": "https://bitcoin.org/bitcoin.pdf",
                    "exchanges": ["Binance", "Coinbase", "Kraken", "Bitfinex"],
                    "recentNews": "Bitcoin ETF inflows continue, institutional adoption growing"
                }
            },
            "ETH": {
                "symbol": "ETH",
                "name": "Ethereum",
                "currentPrice": 4150,
                "change24h": 1.8,
                "volume24h": 15800000000,
                "marketCap": 498000000000,
                "rsi": 52.8,
                "macd": 12,
                "macdSignal": 8,
                "ma20": 4090,
                "ma50": 3980,
                "ma200": 3650,
                "wyckoffPhase": "Markup",
                "elliottWave": "Wave 3 Extension",
                "sentiment": "Bullish",
                "whaleActivity": "Moderate buying",
                "exchangeFlow": "Net inflows: 15,600 ETH",
                "project": {
                    "description": "Smart contract platform enabling decentralized applications and DeFi protocols.",
                    "whitepaper": "https://ethereum.org/whitepaper/",
                    "exchanges": ["Binance", "Coinbase", "Uniswap", "Kraken"],
                    "recentNews": "Ethereum 2.0 staking rewards increase, layer 2 adoption surging"
                }
            },
            "ADA": {
                "symbol": "ADA",
                "name": "Cardano",
                "currentPrice": 1.45,
                "change24h": 3.2,
                "volume24h": 890000000,
                "marketCap": 51200000000,
                "rsi": 58.3,
                "macd": 0.015,
                "macdSignal": 0.012,
                "ma20": 1.38,
                "ma50": 1.29,
                "ma200": 1.15,
                "wyckoffPhase": "Markup",
                "elliottWave": "Wave 1 Impulse",
                "sentiment": "Bullish",
                "whaleActivity": "Strong accumulation",
                "exchangeFlow": "Net outflows: 45M ADA",
                "project": {
                    "description": "Third-generation blockchain platform focused on sustainability and academic research.",
                    "whitepaper": "https://cardano.org/research/",
                    "exchanges": ["Binance", "Coinbase", "Kraken", "KuCoin"],
                    "recentNews": "Cardano smart contracts uptick, partnership with African governments"
                }
            }
        };

        this.marketMetrics = {
            totalMarketCap: 3100000000000,
            btcDominance: 58.2,
            fearGreedIndex: 42,
            activeAddresses: 1250000,
            transactionVolume: 45000000000,
            defiTvl: 97000000000
        };

        this.portfolio = [
            {
                symbol: "BTC",
                avgBuyPrice: 89500,
                allocation: 40,
                holdingTime: "8 months",
                targetPrice: 150000
            },
            {
                symbol: "ETH",
                avgBuyPrice: 3200,
                allocation: 35,
                holdingTime: "6 months",
                targetPrice: 8000
            }
        ];

        this.alerts = [
            {
                type: "price",
                symbol: "BTC",
                condition: "above",
                value: 120000,
                active: true
            },
            {
                type: "volume",
                symbol: "ETH",
                condition: "spike",
                value: 200,
                active: true
            }
        ];

        this.priceChart = null;
        this.currentSymbol = 'BTC';
        
        // Make dashboard globally available first
        window.dashboard = this;
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing CryptoDashboard...');
        this.setupEventListeners();
        this.updateDashboard();
        this.updateMarketOverview();
        this.updatePriceList();
        this.updateTechnicalAnalysis();
        this.updateMarketAnalysis();
        this.updateAlerts();
        
        // Delay chart initialization to ensure canvas is ready
        setTimeout(() => {
            this.initPriceChart();
        }, 500);
        
        this.startPriceUpdates();
        this.checkAlerts();
        console.log('CryptoDashboard initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab navigation with more robust handling
        const navTabs = document.querySelectorAll('.nav-tab');
        console.log('Found nav tabs:', navTabs.length);
        
        navTabs.forEach((tab, index) => {
            console.log(`Setting up listener for tab ${index}:`, tab.dataset.tab);
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Tab clicked:', tab.dataset.tab);
                this.switchTab(tab.dataset.tab);
            });
        });

        // Global click handler for dynamically created elements
        document.addEventListener('click', (e) => {
            // Handle nav tabs
            if (e.target.classList.contains('nav-tab')) {
                e.preventDefault();
                e.stopPropagation();
                const tabName = e.target.dataset.tab;
                console.log('Global nav tab click:', tabName);
                this.switchTab(tabName);
                return;
            }

            // Handle remove holding buttons
            if (e.target.classList.contains('remove-holding-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.dataset.index);
                console.log('Remove holding clicked:', index);
                this.removeHolding(index);
                return;
            }
            
            // Handle alert toggles
            if (e.target.classList.contains('alert-toggle')) {
                e.preventDefault();
                const index = parseInt(e.target.dataset.index);
                console.log('Alert toggle clicked:', index);
                this.toggleAlert(index);
                return;
            }
            
            // Handle remove alert buttons
            if (e.target.classList.contains('remove-alert-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.dataset.index);
                console.log('Remove alert clicked:', index);
                this.removeAlert(index);
                return;
            }

            // Handle add holding button
            if (e.target.id === 'addHoldingBtn') {
                e.preventDefault();
                console.log('Add holding button clicked');
                this.openAddHoldingModal();
                return;
            }

            // Handle create alert button
            if (e.target.id === 'createAlertBtn') {
                e.preventDefault();
                console.log('Create alert button clicked');
                this.openCreateAlertModal();
                return;
            }

            // Handle modal close buttons
            if (e.target.id === 'closeHoldingModal' || e.target.id === 'cancelHolding') {
                e.preventDefault();
                this.closeModal('addHoldingModal');
                return;
            }

            if (e.target.id === 'closeAlertModal' || e.target.id === 'cancelAlert') {
                e.preventDefault();
                this.closeModal('createAlertModal');
                return;
            }

            // Handle save buttons
            if (e.target.id === 'saveHolding') {
                e.preventDefault();
                this.saveHolding();
                return;
            }

            if (e.target.id === 'saveAlert') {
                e.preventDefault();
                this.saveAlert();
                return;
            }

            // Handle research button
            if (e.target.id === 'researchBtn') {
                e.preventDefault();
                this.performResearch();
                return;
            }

            // Handle theme toggle
            if (e.target.id === 'themeToggle') {
                e.preventDefault();
                this.toggleTheme();
                return;
            }

            // Handle modal background clicks
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
                return;
            }
        });

        // Handle form changes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'chartSymbol') {
                this.updateChart(e.target.value);
            }
            
            if (e.target.id === 'alertType') {
                this.updateAlertForm(e.target.value);
            }
        });

        // Handle enter key for research
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'researchSymbol' && e.key === 'Enter') {
                e.preventDefault();
                this.performResearch();
            }
        });

        console.log('Event listeners setup complete');
    }

    switchTab(tabName) {
        if (!tabName) {
            console.log('No tab name provided');
            return;
        }
        
        console.log(`Switching to tab: ${tabName}`);
        
        try {
            // Update active tab button
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
            if (activeTabButton) {
                activeTabButton.classList.add('active');
                console.log('Updated active tab button');
            } else {
                console.error('Active tab button not found for:', tabName);
            }

            // Update active content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const activeContent = document.getElementById(tabName);
            if (activeContent) {
                activeContent.classList.add('active');
                console.log('Updated active content');
            } else {
                console.error('Active content not found for:', tabName);
            }

            // Update specific content when switching tabs
            if (tabName === 'technical') {
                setTimeout(() => {
                    this.updateTechnicalAnalysis();
                    this.initPriceChart();
                }, 200);
            } else if (tabName === 'market') {
                this.updateMarketAnalysis();
            } else if (tabName === 'alerts') {
                this.updateAlerts();
            }

            console.log(`Successfully switched to tab: ${tabName}`);
        } catch (error) {
            console.error('Error switching tabs:', error);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    updateDashboard() {
        this.updatePortfolioSummary();
        this.updateHoldingsList();
    }

    updatePortfolioSummary() {
        let totalValue = 0;
        let totalInvested = 0;

        this.portfolio.forEach(holding => {
            const crypto = this.cryptoData[holding.symbol];
            if (crypto) {
                const holdingValue = crypto.currentPrice * (holding.allocation / 100);
                const invested = holding.avgBuyPrice * (holding.allocation / 100);
                totalValue += holdingValue;
                totalInvested += invested;
            }
        });

        const totalROI = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

        const totalValueEl = document.getElementById('totalValue');
        const totalROIEl = document.getElementById('totalROI');
        const holdingsCountEl = document.getElementById('holdingsCount');

        if (totalValueEl) totalValueEl.textContent = this.formatCurrency(totalValue);
        if (totalROIEl) {
            totalROIEl.textContent = this.formatPercentage(totalROI);
            totalROIEl.className = `stat-value ${totalROI >= 0 ? 'text-success' : 'text-error'}`;
        }
        if (holdingsCountEl) holdingsCountEl.textContent = this.portfolio.length;
    }

    updateHoldingsList() {
        const holdingsList = document.getElementById('holdingsList');
        if (!holdingsList) return;
        
        holdingsList.innerHTML = '';

        this.portfolio.forEach((holding, index) => {
            const crypto = this.cryptoData[holding.symbol];
            if (!crypto) return;

            const currentROI = ((crypto.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
            const targetROI = ((holding.targetPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;

            const holdingElement = document.createElement('div');
            holdingElement.className = 'holding-item';
            holdingElement.innerHTML = `
                <div class="holding-info">
                    <div class="holding-symbol">${crypto.symbol}</div>
                    <div class="holding-details">
                        Avg Buy: ${this.formatCurrency(holding.avgBuyPrice)} | 
                        Allocation: ${holding.allocation}% | 
                        Holding: ${holding.holdingTime}
                    </div>
                    <div class="holding-details">
                        Target: ${this.formatCurrency(holding.targetPrice)} 
                        (${this.formatPercentage(targetROI)} ROI)
                    </div>
                </div>
                <div class="holding-performance">
                    <div class="holding-price">${this.formatCurrency(crypto.currentPrice)}</div>
                    <div class="holding-roi ${currentROI >= 0 ? 'positive' : 'negative'}">
                        ${this.formatPercentage(currentROI)}
                    </div>
                    <button class="btn btn--secondary btn--sm remove-holding-btn" data-index="${index}">Remove</button>
                </div>
            `;
            holdingsList.appendChild(holdingElement);
        });
    }

    updateMarketOverview() {
        const elements = {
            totalMarketCap: document.getElementById('totalMarketCap'),
            btcDominance: document.getElementById('btcDominance'),
            fearGreed: document.getElementById('fearGreed'),
            defiTvl: document.getElementById('defiTvl')
        };

        if (elements.totalMarketCap) elements.totalMarketCap.textContent = this.formatCurrency(this.marketMetrics.totalMarketCap, true);
        if (elements.btcDominance) elements.btcDominance.textContent = `${this.marketMetrics.btcDominance}%`;
        if (elements.fearGreed) elements.fearGreed.textContent = this.marketMetrics.fearGreedIndex;
        if (elements.defiTvl) elements.defiTvl.textContent = this.formatCurrency(this.marketMetrics.defiTvl, true);
    }

    updatePriceList() {
        const priceList = document.getElementById('priceList');
        if (!priceList) return;
        
        priceList.innerHTML = '';

        Object.values(this.cryptoData).forEach(crypto => {
            const priceElement = document.createElement('div');
            priceElement.className = 'price-item';
            priceElement.innerHTML = `
                <div class="price-info">
                    <div class="price-symbol">${crypto.symbol}</div>
                    <div class="price-name">${crypto.name}</div>
                </div>
                <div class="price-data">
                    <div class="price-current">${this.formatCurrency(crypto.currentPrice)}</div>
                    <div class="price-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                        ${this.formatPercentage(crypto.change24h)}
                    </div>
                </div>
            `;
            priceList.appendChild(priceElement);
        });
    }

    updateTechnicalAnalysis() {
        const chartSymbol = document.getElementById('chartSymbol');
        const symbol = chartSymbol ? chartSymbol.value : this.currentSymbol;
        const crypto = this.cryptoData[symbol];
        
        if (!crypto) return;

        // Update indicators
        const elements = {
            rsiValue: document.getElementById('rsiValue'),
            macdValue: document.getElementById('macdValue'),
            ma20Value: document.getElementById('ma20Value'),
            ma50Value: document.getElementById('ma50Value'),
            ma200Value: document.getElementById('ma200Value'),
            volumeValue: document.getElementById('volumeValue'),
            rsiFill: document.getElementById('rsiFill')
        };

        if (elements.rsiValue) elements.rsiValue.textContent = crypto.rsi.toFixed(1);
        if (elements.macdValue) elements.macdValue.textContent = crypto.macd.toFixed(0);
        if (elements.ma20Value) elements.ma20Value.textContent = this.formatCurrency(crypto.ma20);
        if (elements.ma50Value) elements.ma50Value.textContent = this.formatCurrency(crypto.ma50);
        if (elements.ma200Value) elements.ma200Value.textContent = this.formatCurrency(crypto.ma200);
        if (elements.volumeValue) elements.volumeValue.textContent = this.formatCurrency(crypto.volume24h, true);

        // Update RSI bar
        if (elements.rsiFill) {
            const rsiPercentage = crypto.rsi;
            elements.rsiFill.style.width = `${rsiPercentage}%`;
            
            if (rsiPercentage > 70) {
                elements.rsiFill.style.backgroundColor = '#ff5459';
            } else if (rsiPercentage < 30) {
                elements.rsiFill.style.backgroundColor = '#32c584';
            } else {
                elements.rsiFill.style.backgroundColor = '#218589';
            }
        }
    }

    updateMarketAnalysis() {
        const symbol = this.currentSymbol;
        const crypto = this.cryptoData[symbol];
        
        if (!crypto) return;

        const elements = {
            wyckoffPhase: document.getElementById('wyckoffPhase'),
            wyckoffDescription: document.getElementById('wyckoffDescription'),
            trendDirection: document.getElementById('trendDirection'),
            supportLevel: document.getElementById('supportLevel'),
            resistanceLevel: document.getElementById('resistanceLevel'),
            elliottWave: document.getElementById('elliottWave'),
            waveDescription: document.getElementById('waveDescription'),
            whaleActivity: document.getElementById('whaleActivity'),
            exchangeFlow: document.getElementById('exchangeFlow')
        };

        // Wyckoff Analysis
        if (elements.wyckoffPhase) elements.wyckoffPhase.textContent = crypto.wyckoffPhase;
        if (elements.wyckoffDescription) elements.wyckoffDescription.textContent = this.getWyckoffDescription(crypto.wyckoffPhase);
        if (elements.trendDirection) elements.trendDirection.textContent = crypto.sentiment;
        if (elements.supportLevel) elements.supportLevel.textContent = this.formatCurrency(crypto.ma200);
        if (elements.resistanceLevel) elements.resistanceLevel.textContent = this.formatCurrency(crypto.ma20 * 1.05);

        // Elliott Wave
        if (elements.elliottWave) elements.elliottWave.textContent = crypto.elliottWave;
        if (elements.waveDescription) elements.waveDescription.textContent = this.getWaveDescription(crypto.elliottWave);

        // On-chain Analysis
        if (elements.whaleActivity) elements.whaleActivity.textContent = crypto.whaleActivity;
        if (elements.exchangeFlow) elements.exchangeFlow.textContent = crypto.exchangeFlow;
    }

    getWyckoffDescription(phase) {
        const descriptions = {
            'Accumulation': 'Smart money accumulating, sideways price action with low volume',
            'Markup': 'Price trending upward with increasing volume and momentum',
            'Distribution': 'Smart money distributing, high volume but sideways price action',
            'Markdown': 'Price declining with increasing volume as weak hands sell'
        };
        return descriptions[phase] || 'Phase analysis in progress';
    }

    getWaveDescription(wave) {
        const descriptions = {
            'Wave 1 Impulse': 'Initial upward movement, often retraced significantly',
            'Wave 2 Correction': 'Sharp correction of Wave 1, typically 50-78.6% retracement',
            'Wave 3 Extension': 'Strongest upward wave, typically 161.8% of Wave 1',
            'Wave 4 Correction': 'Sideways consolidation, typically 38.2% retracement',
            'Wave 5 Extension': 'Final upward wave, often with divergence in indicators'
        };
        return descriptions[wave] || 'Wave count analysis in progress';
    }

    initPriceChart() {
        const chartCanvas = document.getElementById('priceChart');
        if (!chartCanvas) {
            console.log('Price chart canvas not found');
            return;
        }
        
        const ctx = chartCanvas.getContext('2d');
        
        // Destroy existing chart
        if (this.priceChart) {
            this.priceChart.destroy();
            this.priceChart = null;
        }
        
        // Generate sample price data
        const labels = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString();
        });

        const crypto = this.cryptoData[this.currentSymbol];
        const basePrice = crypto.currentPrice;
        
        // Generate realistic price movement
        const priceData = [];
        let currentPrice = basePrice * 0.9;
        
        for (let i = 0; i < 30; i++) {
            const change = (Math.random() - 0.5) * 0.05;
            currentPrice *= (1 + change);
            priceData.push(currentPrice);
        }

        try {
            this.priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: `${crypto.name} Price`,
                            data: priceData,
                            borderColor: '#1FB8CD',
                            backgroundColor: 'rgba(31, 184, 205, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.1
                        },
                        {
                            label: 'MA 20',
                            data: priceData.map((_, i) => {
                                const start = Math.max(0, i - 19);
                                const slice = priceData.slice(start, i + 1);
                                return slice.reduce((a, b) => a + b, 0) / slice.length;
                            }),
                            borderColor: '#FFC185',
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            fill: false,
                            pointRadius: 0
                        },
                        {
                            label: 'MA 50',
                            data: Array(30).fill(crypto.ma50),
                            borderColor: '#B4413C',
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            fill: false,
                            pointRadius: 0,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                color: 'rgba(167, 169, 169, 0.1)'
                            }
                        },
                        y: {
                            display: true,
                            grid: {
                                color: 'rgba(167, 169, 169, 0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
            console.log('Price chart initialized successfully');
        } catch (error) {
            console.error('Error initializing price chart:', error);
        }
    }

    updateChart(symbol) {
        this.currentSymbol = symbol;
        setTimeout(() => this.initPriceChart(), 100);
    }

    performResearch() {
        const researchSymbol = document.getElementById('researchSymbol');
        if (!researchSymbol) return;
        
        const symbol = researchSymbol.value.toUpperCase();
        const crypto = this.cryptoData[symbol];
        const projectInfo = document.getElementById('projectInfo');
        
        if (!crypto) {
            alert('Cryptocurrency not found. Available symbols: BTC, ETH, ADA');
            return;
        }

        const elements = {
            projectName: document.getElementById('projectName'),
            projectDescription: document.getElementById('projectDescription'),
            researchPrice: document.getElementById('researchPrice'),
            researchChange: document.getElementById('researchChange'),
            researchMarketCap: document.getElementById('researchMarketCap'),
            researchVolume: document.getElementById('researchVolume'),
            recentNews: document.getElementById('recentNews'),
            sentimentValue: document.getElementById('sentimentValue'),
            exchangesList: document.getElementById('exchangesList')
        };

        // Update project information
        if (elements.projectName) elements.projectName.textContent = `${crypto.name} (${crypto.symbol})`;
        if (elements.projectDescription) elements.projectDescription.textContent = crypto.project.description;
        if (elements.researchPrice) elements.researchPrice.textContent = this.formatCurrency(crypto.currentPrice);
        if (elements.researchChange) {
            elements.researchChange.textContent = this.formatPercentage(crypto.change24h);
            elements.researchChange.className = `metric-value ${crypto.change24h >= 0 ? 'text-success' : 'text-error'}`;
        }
        if (elements.researchMarketCap) elements.researchMarketCap.textContent = this.formatCurrency(crypto.marketCap, true);
        if (elements.researchVolume) elements.researchVolume.textContent = this.formatCurrency(crypto.volume24h, true);
        if (elements.recentNews) elements.recentNews.textContent = crypto.project.recentNews;
        if (elements.sentimentValue) {
            elements.sentimentValue.textContent = crypto.sentiment;
            elements.sentimentValue.className = `sentiment-value ${this.getSentimentClass(crypto.sentiment)}`;
        }

        // Update exchanges list
        if (elements.exchangesList) {
            elements.exchangesList.innerHTML = '';
            crypto.project.exchanges.forEach(exchange => {
                const exchangeTag = document.createElement('span');
                exchangeTag.className = 'exchange-tag';
                exchangeTag.textContent = exchange;
                elements.exchangesList.appendChild(exchangeTag);
            });
        }

        if (projectInfo) {
            projectInfo.style.display = 'block';
        }
    }

    getSentimentClass(sentiment) {
        switch(sentiment.toLowerCase()) {
            case 'bullish': return 'text-success';
            case 'bearish': return 'text-error';
            case 'neutral': return 'text-warning';
            default: return '';
        }
    }

    openAddHoldingModal() {
        console.log('Opening add holding modal');
        const modal = document.getElementById('addHoldingModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    openCreateAlertModal() {
        console.log('Opening create alert modal');
        const modal = document.getElementById('createAlertModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Clear form data
        if (modalId === 'addHoldingModal') {
            this.clearHoldingForm();
        } else if (modalId === 'createAlertModal') {
            this.clearAlertForm();
        }
    }

    clearHoldingForm() {
        const elements = {
            holdingSymbol: document.getElementById('holdingSymbol'),
            avgBuyPrice: document.getElementById('avgBuyPrice'),
            allocation: document.getElementById('allocation'),
            holdingTime: document.getElementById('holdingTime'),
            targetPrice: document.getElementById('targetPrice')
        };

        if (elements.holdingSymbol) elements.holdingSymbol.value = 'BTC';
        if (elements.avgBuyPrice) elements.avgBuyPrice.value = '';
        if (elements.allocation) elements.allocation.value = '';
        if (elements.holdingTime) elements.holdingTime.value = '';
        if (elements.targetPrice) elements.targetPrice.value = '';
    }

    clearAlertForm() {
        const elements = {
            alertSymbol: document.getElementById('alertSymbol'),
            alertType: document.getElementById('alertType'),
            alertCondition: document.getElementById('alertCondition'),
            alertValue: document.getElementById('alertValue')
        };

        if (elements.alertSymbol) elements.alertSymbol.value = 'BTC';
        if (elements.alertType) elements.alertType.value = 'price';
        if (elements.alertCondition) elements.alertCondition.value = 'above';
        if (elements.alertValue) elements.alertValue.value = '';
    }

    saveHolding() {
        console.log('Saving holding...');
        const elements = {
            holdingSymbol: document.getElementById('holdingSymbol'),
            avgBuyPrice: document.getElementById('avgBuyPrice'),
            allocation: document.getElementById('allocation'),
            holdingTime: document.getElementById('holdingTime'),
            targetPrice: document.getElementById('targetPrice')
        };

        if (!elements.holdingSymbol || !elements.avgBuyPrice || !elements.allocation || 
            !elements.holdingTime || !elements.targetPrice) {
            console.error('Form elements not found');
            alert('Form elements not found');
            return;
        }

        const symbol = elements.holdingSymbol.value;
        const avgBuyPrice = parseFloat(elements.avgBuyPrice.value);
        const allocation = parseFloat(elements.allocation.value);
        const holdingTime = elements.holdingTime.value;
        const targetPrice = parseFloat(elements.targetPrice.value);

        if (!avgBuyPrice || !allocation || !holdingTime || !targetPrice) {
            alert('Please fill in all fields');
            return;
        }

        if (allocation <= 0 || allocation > 100) {
            alert('Allocation must be between 1 and 100 percent');
            return;
        }

        const newHolding = {
            symbol,
            avgBuyPrice,
            allocation,
            holdingTime,
            targetPrice
        };

        this.portfolio.push(newHolding);
        this.updateDashboard();
        this.closeModal('addHoldingModal');
        this.showNotification('Success', 'Holding added to portfolio successfully');
        console.log('Holding saved successfully');
    }

    removeHolding(index) {
        console.log('Removing holding at index:', index);
        if (confirm('Are you sure you want to remove this holding?')) {
            this.portfolio.splice(index, 1);
            this.updateDashboard();
            this.showNotification('Success', 'Holding removed from portfolio');
        }
    }

    updateAlertForm(alertType) {
        const conditionSelect = document.getElementById('alertCondition');
        const valueLabel = document.querySelector('label[for="alertValue"]');
        
        if (!conditionSelect || !valueLabel) return;
        
        if (alertType === 'volume') {
            conditionSelect.innerHTML = '<option value="spike">Volume Spike</option>';
            valueLabel.textContent = 'Spike Threshold (%)';
        } else {
            conditionSelect.innerHTML = `
                <option value="above">Above</option>
                <option value="below">Below</option>
            `;
            valueLabel.textContent = 'Target Price ($)';
        }
    }

    saveAlert() {
        console.log('Saving alert...');
        const elements = {
            alertSymbol: document.getElementById('alertSymbol'),
            alertType: document.getElementById('alertType'),
            alertCondition: document.getElementById('alertCondition'),
            alertValue: document.getElementById('alertValue')
        };

        if (!elements.alertSymbol || !elements.alertType || 
            !elements.alertCondition || !elements.alertValue) {
            console.error('Form elements not found');
            alert('Form elements not found');
            return;
        }

        const symbol = elements.alertSymbol.value;
        const type = elements.alertType.value;
        const condition = elements.alertCondition.value;
        const value = parseFloat(elements.alertValue.value);

        if (!value) {
            alert('Please enter a valid target value');
            return;
        }

        const newAlert = {
            type,
            symbol,
            condition,
            value,
            active: true
        };

        this.alerts.push(newAlert);
        this.updateAlerts();
        this.closeModal('createAlertModal');
        this.showNotification('Success', 'Alert created successfully');
        console.log('Alert saved successfully');
    }

    updateAlerts() {
        const alertsList = document.getElementById('alertsList');
        const alertCount = document.getElementById('alertCount');
        
        if (!alertsList || !alertCount) return;
        
        alertsList.innerHTML = '';
        alertCount.textContent = this.alerts.filter(alert => alert.active).length;

        this.alerts.forEach((alert, index) => {
            const alertElement = document.createElement('div');
            alertElement.className = 'alert-item';
            
            const description = alert.type === 'price' 
                ? `${alert.symbol} ${alert.condition} $${alert.value.toLocaleString()}`
                : `${alert.symbol} volume spike ${alert.value}%`;

            alertElement.innerHTML = `
                <div class="alert-info">
                    <div class="alert-type">${alert.type} alert</div>
                    <div class="alert-description">${description}</div>
                </div>
                <div class="alert-actions">
                    <button class="alert-toggle ${alert.active ? 'active' : 'inactive'}" data-index="${index}">
                        ${alert.active ? 'Active' : 'Inactive'}
                    </button>
                    <button class="btn btn--secondary btn--sm remove-alert-btn" data-index="${index}">
                        Delete
                    </button>
                </div>
            `;
            alertsList.appendChild(alertElement);
        });
    }

    toggleAlert(index) {
        console.log('Toggling alert at index:', index);
        if (this.alerts[index]) {
            this.alerts[index].active = !this.alerts[index].active;
            this.updateAlerts();
        }
    }

    removeAlert(index) {
        console.log('Removing alert at index:', index);
        if (confirm('Are you sure you want to delete this alert?')) {
            this.alerts.splice(index, 1);
            this.updateAlerts();
        }
    }

    checkAlerts() {
        this.alerts.forEach(alert => {
            if (!alert.active) return;

            const crypto = this.cryptoData[alert.symbol];
            if (!crypto) return;

            let triggered = false;
            let message = '';

            if (alert.type === 'price') {
                if (alert.condition === 'above' && crypto.currentPrice >= alert.value) {
                    triggered = true;
                    message = `${alert.symbol} has reached $${alert.value.toLocaleString()}!`;
                } else if (alert.condition === 'below' && crypto.currentPrice <= alert.value) {
                    triggered = true;
                    message = `${alert.symbol} has dropped below $${alert.value.toLocaleString()}!`;
                }
            } else if (alert.type === 'volume') {
                // Simulate volume spike detection
                if (Math.random() < 0.1) {
                    triggered = true;
                    message = `${alert.symbol} volume spike detected! +${alert.value}% volume increase`;
                }
            }

            if (triggered) {
                this.showNotification('Alert Triggered', message);
                // Disable alert after triggering
                alert.active = false;
                this.updateAlerts();
            }
        });
    }

    showNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'alert-notification';
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;

        const notificationsContainer = document.getElementById('alertNotifications');
        if (notificationsContainer) {
            notificationsContainer.appendChild(notification);

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }
    }

    startPriceUpdates() {
        setInterval(() => {
            // Simulate price updates
            Object.keys(this.cryptoData).forEach(symbol => {
                const crypto = this.cryptoData[symbol];
                const change = (Math.random() - 0.5) * 0.02; // ±1% random change
                crypto.currentPrice *= (1 + change);
                crypto.change24h += change * 100;
                
                // Update RSI randomly within realistic bounds
                crypto.rsi += (Math.random() - 0.5) * 2;
                crypto.rsi = Math.max(0, Math.min(100, crypto.rsi));
            });

            // Update displays if on relevant tabs
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab) {
                const tabId = activeTab.id;
                
                if (tabId === 'dashboard') {
                    this.updateDashboard();
                    this.updatePriceList();
                } else if (tabId === 'technical') {
                    this.updateTechnicalAnalysis();
                }
            }

            // Check alerts every update
            this.checkAlerts();
        }, 5000); // Update every 5 seconds
    }

    formatCurrency(value, abbreviated = false) {
        if (abbreviated && value >= 1e9) {
            return `$${(value / 1e9).toFixed(1)}B`;
        } else if (abbreviated && value >= 1e6) {
            return `$${(value / 1e6).toFixed(1)}M`;
        } else if (abbreviated && value >= 1e3) {
            return `$${(value / 1e3).toFixed(1)}K`;
        } else if (value >= 1) {
            return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            return `$${value.toFixed(6)}`;
        }
    }

    formatPercentage(value) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
}

// Initialize the dashboard when DOM is loaded
new CryptoDashboard();