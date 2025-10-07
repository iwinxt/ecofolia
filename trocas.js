document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO MENU MOBILE ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('nav');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // --- VARIÁVEIS GLOBAIS ---
    let currentPage = 1;
    const itemsPerPage = 6;
    let allItems = [];
    let favoritos = JSON.parse(localStorage.getItem('favoritosTrocas')) || [];
    let currentUser = null;
    let minhasFantasias = JSON.parse(localStorage.getItem('minhasFantasias')) || [];

    // --- DADOS DE EXEMPLO (substituir por API real) ---
    const mockData = [
        {
            id: 1,
            titulo: "Fantasia Reciclada",
            imagem: "https://coisasdamaria.com/wp-content/uploads/disfarce-carnaval-reciclado.jpg",
            descricao: "Feita de materiais 100% reciclados. Leve e confortável para longas horas de festa. Inclui acessórios.",
            usuario: "Ana Clara",
            localizacao: "Salvador, BA",
            trocaPor: "Fantasia de Carnaval",
            categoria: "carnaval",
            tamanho: "g",
            estado: "ba",
            condicao: "pouco-uso",
            rating: 4.5,
            status: "disponivel",
            destaque: true,
            userId: null // Para fantasias do sistema
        },
        {
            id: 2,
            titulo: "Fantasia Pet Sustentável",
            imagem: "https://www.petsupport.com.br/wp-content/uploads/2023/02/fantasias-para-pet-e-tutor-1024x683.jpg",
            descricao: "Fantasia de super heroi para pet, feita com tecidos orgânicos. Nunca usada, em perfeito estado.",
            usuario: "João Pedro",
            localizacao: "Feira de Santana, BA",
            trocaPor: "Fantasia de Super-Herói",
            categoria: "animal",
            tamanho: "pp",
            estado: "ba",
            condicao: "nova",
            rating: 5,
            status: "disponivel",
            destaque: false,
            userId: null
        },
        {
            id: 3,
            titulo: "Fantasia Tribal",
            imagem: "https://www.conexaolusofona.org/wp-content/uploads/2019/02/carnaval-sustent%C3%A1vel-750x500.jpg",
            descricao: "Fantasia leve e artesanal, inspirada em temas tribais. Perfeita para eventos culturais e festas a fantasia.",
            usuario: "Camila S.",
            localizacao: "Rio de Janeiro, RJ",
            trocaPor: "Fantasia de Carnaval",
            categoria: "historico",
            tamanho: "m",
            estado: "rj",
            condicao: "usada",
            rating: 3.5,
            status: "disponivel",
            destaque: true,
            userId: null
        },
        {
            id: 4,
            titulo: "Fantasia Fada",
            imagem: "https://fantasiainfantil.com/cdn/shop/products/fantasia-fada-sininho-verde-infantil-543532.webp?v=1709772389",
            descricao: "Fantasia leve e simples, inspirada em tema magicos. Perfeita para festas a fantasia.",
            usuario: "Lucas Silva.",
            localizacao: "Feira de Santana, BA",
            trocaPor: "Fantasia de Animal",
            categoria: "filmes",
            tamanho: "p",
            estado: "ba",
            condicao: "usada",
            rating: 4,
            status: "disponivel",
            destaque: true,
            userId: null
        }
    ];

    // --- MODAL DE LOGIN/CADASTRO ---
    function createAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'authModal';
        modal.innerHTML = `
            <div class="modal-content modal-auth">
                <div class="modal-header">
                    <h3>Entrar na Eco-Folia</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Login</button>
                        <button class="auth-tab" data-tab="signup">Cadastrar</button>
                    </div>
                    
                    <form id="loginForm" class="auth-form active">
                        <div class="form-group">
                            <label for="loginEmail">E-mail:</label>
                            <input type="email" id="loginEmail" placeholder="seu@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Senha:</label>
                            <input type="password" id="loginPassword" placeholder="Sua senha" required>
                        </div>
                        <button type="submit" class="btn primary full-width">
                            <i class="fas fa-sign-in-alt"></i> Entrar
                        </button>
                    </form>
                    
                    <form id="signupForm" class="auth-form">
                        <div class="form-group">
                            <label for="signupNome">Nome:</label>
                            <input type="text" id="signupNome" placeholder="Seu nome completo" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">E-mail:</label>
                            <input type="email" id="signupEmail" placeholder="seu@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Senha:</label>
                            <input type="password" id="signupPassword" placeholder="Mínimo 6 caracteres" required minlength="6">
                        </div>
                        <button type="submit" class="btn primary full-width">
                            <i class="fas fa-user-plus"></i> Cadastrar
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setupAuthModal();
    }

    function setupAuthModal() {
        const modal = document.getElementById('authModal');
        const closeBtn = modal.querySelector('.close-modal');
        const tabs = modal.querySelectorAll('.auth-tab');
        const forms = modal.querySelectorAll('.auth-form');
        
        // Alternar entre login e cadastro
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Ativar tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Mostrar form correspondente
                forms.forEach(form => form.classList.remove('active'));
                document.getElementById(`${tabName}Form`).classList.add('active');
            });
        });
        
        // Fechar modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // Formulário de login
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                // Importar e usar as funções de auth
                const authModule = await import('./auth.js');
                await authModule.signIn(email, password);
                modal.classList.remove('show');
                
                // Atualizar usuário atual
                currentUser = authModule.getCurrentUser ? authModule.getCurrentUser() : { email: email };
                updateUIForAuthStatus();
                renderItems(); // Re-renderizar para atualizar botões
                
            } catch (error) {
                console.error('Erro no login:', error);
            }
        });
        
        // Formulário de cadastro
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('signupNome').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            try {
                // Importar e usar as funções de auth
                const authModule = await import('./auth.js');
                await authModule.signUp(email, password, { nome });
                modal.classList.remove('show');
                
                // Atualizar usuário atual
                currentUser = authModule.getCurrentUser ? authModule.getCurrentUser() : { email: email };
                updateUIForAuthStatus();
                renderItems(); // Re-renderizar para atualizar botões
                
            } catch (error) {
                console.error('Erro no cadastro:', error);
            }
        });
    }

    // --- FUNÇÕES PARA UPLOAD DE IMAGEM ---
    let imageUploadHandler = null;

    function setupImageUpload() {
        const fileInput = document.getElementById('fantasiaImagem');
        const uploadArea = document.getElementById('imageUploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const removeBtn = document.getElementById('removeImage');
        
        let currentImageFile = null;

        // Clique na área de upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Alteração no input de arquivo
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                handleImageSelection(this.files[0]);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    handleImageSelection(file);
                } else {
                    alert('Por favor, selecione apenas arquivos de imagem.');
                }
            }
        });

        // Remover imagem
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            resetImageUpload();
        });

        function handleImageSelection(file) {
            // Validar tamanho do arquivo (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem é muito grande. Por favor, selecione uma imagem menor que 5MB.');
                return;
            }

            currentImageFile = file;

            // Mostrar loading
            uploadArea.classList.add('uploading');
            uploadArea.innerHTML = '<i class="fas fa-spinner"></i><p>Processando imagem...</p>';

            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Restaurar área de upload
                uploadArea.classList.remove('uploading');
                uploadArea.style.display = 'none';
                
                // Mostrar preview
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            
            reader.onerror = function() {
                alert('Erro ao carregar a imagem. Tente novamente.');
                resetImageUpload();
            };
            
            reader.readAsDataURL(file);
        }

        function resetImageUpload() {
            fileInput.value = '';
            currentImageFile = null;
            imagePreview.style.display = 'none';
            uploadArea.style.display = 'block';
            uploadArea.classList.remove('uploading');
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Clique para selecionar uma imagem</p>
                <span>ou arraste e solte aqui</span>
                <small>Formatos: JPG, PNG, GIF (Máx. 5MB)</small>
            `;
        }

        return {
            getCurrentImage: () => currentImageFile,
            reset: resetImageUpload
        };
    }

    // --- MODAL PARA ADICIONAR FANTASIA ---
    function setupAddFantasiaModal() {
        const modal = document.getElementById('modalAddFantasia');
        const closeBtn = modal.querySelector('.close-modal');
        const form = document.getElementById('formAddFantasia');
        const btnAddFantasia = document.getElementById('btnAddFantasia');
        
        // Inicializar upload de imagem
        imageUploadHandler = setupImageUpload();
        
        // Abrir modal
        if (btnAddFantasia) {
            btnAddFantasia.addEventListener('click', () => {
                if (!currentUser) {
                    // Se não estiver logado, mostrar modal de autenticação
                    const authModal = document.getElementById('authModal');
                    if (authModal) {
                        authModal.classList.add('show');
                    }
                    return;
                }
                modal.classList.add('show');
                form.reset();
                // Resetar upload de imagem também
                if (imageUploadHandler) {
                    imageUploadHandler.reset();
                }
            });
        }
        
        // Fechar modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // Submissão do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            adicionarFantasia();
        });
    }

    function adicionarFantasia() {
        const form = document.getElementById('formAddFantasia');
        
        // Verificar se há imagem selecionada
        if (!imageUploadHandler || !imageUploadHandler.getCurrentImage()) {
            alert('Por favor, selecione uma imagem para a fantasia.');
            return;
        }
        
        const imageFile = imageUploadHandler.getCurrentImage();
        
        // Simular upload (em produção, você enviaria para um servidor)
        // Aqui vamos usar a URL de dados base64 diretamente
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Criar nova fantasia com a imagem
            const novaFantasia = {
                id: Date.now(), // ID único baseado no timestamp
                titulo: document.getElementById('fantasiaTitulo').value,
                descricao: document.getElementById('fantasiaDescricao').value,
                imagem: e.target.result, // URL de dados base64
                usuario: currentUser.email ? currentUser.email.split('@')[0] : 'Usuário',
                localizacao: document.getElementById('fantasiaLocalizacao').value,
                trocaPor: document.getElementById('fantasiaTrocaPor').value,
                categoria: document.getElementById('fantasiaCategoria').value,
                tamanho: document.getElementById('fantasiaTamanho').value,
                estado: document.getElementById('fantasiaEstado').value,
                condicao: document.getElementById('fantasiaCondicao').value,
                rating: 0, // Nova fantasia sem avaliações
                status: "disponivel",
                destaque: false,
                userId: currentUser.uid || currentUser.email, // Identificar o dono
                dataCriacao: new Date().toISOString()
            };
            
            // Adicionar à lista de minhas fantasias
            minhasFantasias.push(novaFantasia);
            localStorage.setItem('minhasFantasias', JSON.stringify(minhasFantasias));
            
            // Fechar modal e mostrar mensagem de sucesso
            document.getElementById('modalAddFantasia').classList.remove('show');
            alert('Fantasia anunciada com sucesso!');
            
            // Atualizar a lista
            renderItems();
        };
        
        reader.onerror = function() {
            alert('Erro ao processar a imagem. Tente novamente.');
        };
        
        reader.readAsDataURL(imageFile);
    }

    // --- FUNÇÕES PARA GERENCIAR MINHAS FANTASIAS ---
    function editarFantasia(itemId) {
        const fantasia = minhasFantasias.find(f => f.id === itemId);
        if (!fantasia) return;
        
        // Preencher formulário com dados existentes
        document.getElementById('fantasiaTitulo').value = fantasia.titulo;
        document.getElementById('fantasiaDescricao').value = fantasia.descricao;
        document.getElementById('fantasiaCategoria').value = fantasia.categoria;
        document.getElementById('fantasiaTamanho').value = fantasia.tamanho;
        document.getElementById('fantasiaEstado').value = fantasia.estado;
        document.getElementById('fantasiaCondicao').value = fantasia.condicao;
        document.getElementById('fantasiaTrocaPor').value = fantasia.trocaPor;
        document.getElementById('fantasiaLocalizacao').value = fantasia.localizacao;
        
        // Se já há uma imagem, mostrar preview
        if (fantasia.imagem && imageUploadHandler) {
            const uploadArea = document.getElementById('imageUploadArea');
            const imagePreview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            
            uploadArea.style.display = 'none';
            previewImg.src = fantasia.imagem;
            imagePreview.style.display = 'block';
        }
        
        // Abrir modal de edição
        document.getElementById('modalAddFantasia').classList.add('show');
        
        // Remover a fantasia antiga quando salvar
        const form = document.getElementById('formAddFantasia');
        const originalSubmit = form.onsubmit;
        
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Se nova imagem foi selecionada, usar ela, senão manter a atual
            const currentImage = imageUploadHandler ? imageUploadHandler.getCurrentImage() : null;
            
            if (currentImage) {
                // Processar nova imagem
                const reader = new FileReader();
                reader.onload = function(event) {
                    updateFantasia(itemId, event.target.result);
                };
                reader.readAsDataURL(currentImage);
            } else {
                // Manter imagem atual
                updateFantasia(itemId, fantasia.imagem);
            }
        };
        
        function updateFantasia(itemId, imagemUrl) {
            const index = minhasFantasias.findIndex(f => f.id === itemId);
            if (index !== -1) {
                minhasFantasias[index] = {
                    ...minhasFantasias[index],
                    titulo: document.getElementById('fantasiaTitulo').value,
                    descricao: document.getElementById('fantasiaDescricao').value,
                    imagem: imagemUrl,
                    categoria: document.getElementById('fantasiaCategoria').value,
                    tamanho: document.getElementById('fantasiaTamanho').value,
                    estado: document.getElementById('fantasiaEstado').value,
                    condicao: document.getElementById('fantasiaCondicao').value,
                    trocaPor: document.getElementById('fantasiaTrocaPor').value,
                    localizacao: document.getElementById('fantasiaLocalizacao').value
                };
                
                localStorage.setItem('minhasFantasias', JSON.stringify(minhasFantasias));
                document.getElementById('modalAddFantasia').classList.remove('show');
                alert('Fantasia atualizada com sucesso!');
                renderItems();
            }
            
            // Restaurar o event listener original
            form.onsubmit = originalSubmit;
        }
    }

    function excluirFantasia(itemId) {
        if (!confirm('Tem certeza que deseja excluir esta fantasia?')) {
            return;
        }
        
        minhasFantasias = minhasFantasias.filter(f => f.id !== itemId);
        localStorage.setItem('minhasFantasias', JSON.stringify(minhasFantasias));
        alert('Fantasia excluída com sucesso!');
        renderItems();
    }

    // --- FUNÇÕES DE AUTENTICAÇÃO PARA TROCAS ---
    async function checkAuthBeforeAction(actionCallback, itemId = null) {
        try {
            // Tentar obter o usuário do Firebase
            const authModule = await import('./auth.js');
            const user = authModule.getCurrentUser ? authModule.getCurrentUser() : currentUser;
            
            if (!user) {
                // Mostrar modal de autenticação
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.classList.add('show');
                }
                return false;
            }
            
            // Usuário autenticado, executar a ação
            return actionCallback(user, itemId);
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    }

    // --- ATUALIZAR A RENDERIZAÇÃO PARA MOSTRAR STATUS DE LOGIN ---
    async function updateUIForAuthStatus() {
        try {
            const authModule = await import('./auth.js');
            currentUser = authModule.getCurrentUser ? authModule.getCurrentUser() : null;
        } catch (error) {
            console.log('Módulo de auth não disponível, usando fallback');
        }
        
        const authStatus = document.getElementById('authStatus');
        if (!authStatus) return;
        
        authStatus.innerHTML = '';
        
        if (currentUser) {
            // Usuário logado - mostrar informações do usuário
            authStatus.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">Olá, ${currentUser.email ? currentUser.email.split('@')[0] : 'Usuário'}</span>
                    <button class="btn small secondary" id="logoutBtnTrocas">
                        <i class="fas fa-sign-out-alt"></i> <span>Sair</span>
                    </button>
                </div>
            `;
            
            // Event listener para logout
            document.getElementById('logoutBtnTrocas').addEventListener('click', async () => {
                try {
                    const authModule = await import('./auth.js');
                    if (authModule.logout) {
                        await authModule.logout();
                    }
                    currentUser = null;
                    updateUIForAuthStatus();
                    renderItems(); // Re-renderizar para atualizar botões
                } catch (error) {
                    console.error('Erro no logout:', error);
                }
            });
            
        } else {
            // Usuário não logado - mostrar botão de login
            authStatus.innerHTML = `
                <button class="btn small primary" id="loginBtnTrocas">
                    <i class="fas fa-sign-in-alt"></i> <span>Entrar</span>
                </button>
            `;
            
            // Event listener para login
            document.getElementById('loginBtnTrocas').addEventListener('click', () => {
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.classList.add('show');
                }
            });
        }
    }

    // --- INICIALIZAÇÃO ---
    allItems = [...mockData, ...minhasFantasias];
    createAuthModal(); // Criar modal de autenticação
    setupAddFantasiaModal(); // Configurar modal de adicionar fantasia
    renderItems();
    setupEventListeners();
    updateUIForAuthStatus(); // Atualizar UI baseada no status de autenticação

    // --- CONFIGURAÇÃO DE EVENT LISTENERS ---
    function setupEventListeners() {
        // Filtros avançados
        const filtrosToggle = document.getElementById('filtrosToggle');
        const filtrosContent = document.getElementById('filtrosContent');
        
        if (filtrosToggle && filtrosContent) {
            filtrosToggle.addEventListener('click', () => {
                filtrosContent.style.display = filtrosContent.style.display === 'none' ? 'grid' : 'none';
                const toggleIcon = document.querySelector('.filtros-toggle');
                if (toggleIcon) {
                    toggleIcon.classList.toggle('rotated');
                }
            });
        }

        // Filtros em tempo real
        const filtros = document.querySelectorAll('#categoria, #tamanho, #estado, #condicao');
        filtros.forEach(filtro => {
            filtro.addEventListener('change', aplicarFiltros);
        });

        // Busca em tempo real
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(aplicarFiltros, 300));
        }

        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', aplicarFiltros);
        }

        // Modal de solicitação
        const modal = document.getElementById('modalSolicitacao');
        const closeModal = document.querySelector('.close-modal');
        const cancelarBtn = document.getElementById('cancelarSolicitacao');
        const confirmarBtn = document.getElementById('confirmarSolicitacao');

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        if (confirmarBtn) {
            confirmarBtn.addEventListener('click', handleSolicitacaoTroca);
        }

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // --- HANDLERS DE EVENTOS ---
    function handleSolicitacaoTroca() {
        if (!currentUser) {
            alert('Você precisa estar logado para solicitar uma troca.');
            return;
        }

        const mensagem = document.getElementById('mensagemTroca').value;
        alert(`Solicitação de troca enviada com sucesso! Mensagem: ${mensagem || 'Nenhuma mensagem adicional'}\nUsuário: ${currentUser.email}`);
        
        // Fechar o modal
        document.getElementById('modalSolicitacao').classList.remove('show');
        
        // Limpar o campo de mensagem
        document.getElementById('mensagemTroca').value = '';
    }

    function toggleFavorito(itemId) {
        return checkAuthBeforeAction((user, itemId) => {
            const index = favoritos.indexOf(itemId);
            
            if (index === -1) {
                // Adicionar aos favoritos
                favoritos.push(itemId);
            } else {
                // Remover dos favoritos
                favoritos.splice(index, 1);
            }
            
            // Salvar no localStorage
            localStorage.setItem('favoritosTrocas', JSON.stringify(favoritos));
            
            // Atualizar a exibição
            renderItems();
            return true;
        }, itemId);
    }

    function solicitarTroca(itemId) {
        return checkAuthBeforeAction((user, itemId) => {
            const item = allItems.find(i => i.id === itemId);
            if (!item) return false;
            
            // Preencher modal com informações
            document.getElementById('modalFantasiaOferecida').textContent = 'sua fantasia';
            document.getElementById('modalFantasiaDesejada').textContent = item.titulo;
            
            // Mostrar modal de solicitação
            document.getElementById('modalSolicitacao').classList.add('show');
            return true;
        }, itemId);
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function renderItems() {
        const trocasLista = document.getElementById('trocasLista');
        const paginacao = document.getElementById('paginacao');
        
        if (!trocasLista) return;
        
        // Combinar dados mock com minhas fantasias
        allItems = [...mockData, ...minhasFantasias];
        
        // Aplicar filtros e paginação
        const filteredItems = filtrarItems();
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
        
        // Limpar lista
        trocasLista.innerHTML = '';
        
        // Verificar se há resultados
        if (paginatedItems.length === 0) {
            trocasLista.innerHTML = `
                <div class="nenhum-resultado">
                    <i class="fas fa-search"></i>
                    <h3>Nenhuma fantasia encontrada</h3>
                    <p>Tente ajustar os filtros ou buscar por termos diferentes.</p>
                </div>
            `;
            paginacao.innerHTML = '';
            return;
        }
        
        // Renderizar items
        paginatedItems.forEach(item => {
            const isFavorito = favoritos.includes(item.id);
            const isMinhaFantasia = item.userId && currentUser && 
                                   (item.userId === currentUser.uid || item.userId === currentUser.email);
            const ratingStars = renderRatingStars(item.rating);
            
            const statusClass = `status-${item.status}`;
            const statusText = {
                'disponivel': 'Disponível para troca',
                'pendente': 'Troca em andamento',
                'finalizada': 'Troca finalizada'
            }[item.status] || 'Disponível para troca';
            
            const card = document.createElement('div');
            card.className = 'fantasia-card';
            card.innerHTML = `
                <div class="fantasia-img">
                    <img src="${item.imagem}" alt="${item.titulo}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Indispon%C3%ADvel'">
                    <button class="favorito-btn ${isFavorito ? 'favoritado' : ''}" data-id="${item.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    ${item.destaque ? '<div class="card-badge destaque">Destaque</div>' : ''}
                    ${isMinhaFantasia ? '<div class="card-badge minha-fantasia">Minha</div>' : ''}
                    <div class="card-badge">${item.condicao === 'nova' ? 'Nova' : item.condicao === 'pouco-uso' ? 'Pouco uso' : 'Usada'}</div>
                </div>
                <div class="fantasia-info">
                    <div class="fantasia-header">
                        <h3>${item.titulo}</h3>
                        <div class="rating">${ratingStars}</div>
                    </div>
                    <p class="fantasia-desc">${item.descricao}</p>
                    <div class="fantasia-meta">
                        <span><i class="fas fa-user-circle"></i> ${item.usuario} (${item.localizacao})</span>
                        <span><i class="fas fa-arrows-alt-h"></i> Troca por: ${item.trocaPor}</span>
                        <span class="status-troca ${statusClass}">${statusText}</span>
                    </div>
                    ${isMinhaFantasia ? 
                        `<div class="minhas-fantasias-actions">
                            <button class="btn-edit" data-id="${item.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-delete" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>` :
                        `<button class="btn small primary solicitar-troca" data-id="${item.id}">
                            ${currentUser ? 'Solicitar Troca' : 'Faça login para trocar'}
                        </button>`
                    }
                </div>
                ${!currentUser ? `
                    <div class="auth-required-overlay">
                        <div class="auth-required-message">
                            <i class="fas fa-lock"></i>
                            <h4>Login Necessário</h4>
                            <p>Faça login para solicitar trocas</p>
                        </div>
                    </div>
                ` : ''}
            `;
            
            trocasLista.appendChild(card);
        });
        
        // Configurar eventos dos cards
        setTimeout(() => {
            document.querySelectorAll('.favorito-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = parseInt(btn.getAttribute('data-id'));
                    toggleFavorito(itemId);
                });
            });
            
            document.querySelectorAll('.solicitar-troca').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = parseInt(btn.getAttribute('data-id'));
                    solicitarTroca(itemId);
                });
            });
            
            // Eventos para minhas fantasias
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = parseInt(btn.getAttribute('data-id'));
                    editarFantasia(itemId);
                });
            });
            
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = parseInt(btn.getAttribute('data-id'));
                    excluirFantasia(itemId);
                });
            });
        }, 0);
        
        // Renderizar paginação
        renderPaginacao(totalPages);
        
        // Animar cards
        animateCards();
    }

    function renderRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }

    function renderPaginacao(totalPages) {
        const paginacao = document.getElementById('paginacao');
        if (!paginacao || totalPages <= 1) {
            paginacao.innerHTML = '';
            return;
        }
        
        let paginacaoHTML = '';
        
        // Botão anterior
        if (currentPage > 1) {
            paginacaoHTML += `<button class="pagina-btn" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`;
        }
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginacaoHTML += `<button class="pagina-btn ativa" data-page="${i}">${i}</button>`;
            } else {
                paginacaoHTML += `<button class="pagina-btn" data-page="${i}">${i}</button>`;
            }
        }
        
        // Botão próximo
        if (currentPage < totalPages) {
            paginacaoHTML += `<button class="pagina-btn" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`;
        }
        
        paginacao.innerHTML = paginacaoHTML;
        
        // Adicionar event listeners
        document.querySelectorAll('.pagina-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                if (page !== currentPage) {
                    currentPage = page;
                    renderItems();
                    window.scrollTo({ top: document.getElementById('trocasLista').offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }

    // --- FUNÇÕES DE FILTRO E BUSCA ---
    function aplicarFiltros() {
        currentPage = 1;
        renderItems();
    }

    function filtrarItems() {
        const searchTerm = document.querySelector('.search-input').value.toLowerCase();
        const categoria = document.getElementById('categoria').value;
        const tamanho = document.getElementById('tamanho').value;
        const estado = document.getElementById('estado').value;
        const condicao = document.getElementById('condicao').value;
        
        return allItems.filter(item => {
            // Filtro de busca geral
            if (searchTerm && 
                !item.titulo.toLowerCase().includes(searchTerm) &&
                !item.descricao.toLowerCase().includes(searchTerm) &&
                !item.localizacao.toLowerCase().includes(searchTerm) &&
                !item.trocaPor.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Filtro de categoria
            if (categoria && item.categoria !== categoria) {
                return false;
            }
            
            // Filtro de tamanho
            if (tamanho && item.tamanho !== tamanho) {
                return false;
            }
            
            // Filtro de estado
            if (estado && item.estado !== estado) {
                return false;
            }
            
            // Filtro de condição
            if (condicao && item.condicao !== condicao) {
                return false;
            }
            
            return true;
        });
    }

    // --- ANIMAÇÕES E UTILITÁRIOS ---
    function animateCards() {
        const fantasiaCards = document.querySelectorAll('.fantasia-card');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        fantasiaCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});