
// Core interactions and simulated backend using localStorage
(function(){
  // helpers
  const qs = s => document.querySelector(s);
  const qsa = s => document.querySelectorAll(s);

  // store/get users
  function getUsers(){ return JSON.parse(localStorage.getItem('cv_users')||'[]'); }
  function saveUsers(u){ localStorage.setItem('cv_users', JSON.stringify(u)); }

  // on cadastro page, handle form if exists
  const cadastroForm = qs('#formCadastro');
  if(cadastroForm){
    cadastroForm.addEventListener('submit', function(e){
      e.preventDefault();
      const nome=this.nome.value.trim();
      const email=this.email.value.trim();
      const senha=this.senha.value;
      const senha2=this.senha2.value;
      const tipo=this.tipoUsuario.value;
      const msgEl=qs('#msgCadastro');
      if(!nome||!email||!senha||!tipo){ msgEl.style.color='red'; msgEl.textContent='Preencha todos os campos.'; return;}
      if(senha!==senha2){ msgEl.style.color='red'; msgEl.textContent='As senhas não batem.'; return;}
      const users=getUsers();
      if(users.find(u=>u.email===email)){ msgEl.style.color='red'; msgEl.textContent='Já existe usuário com esse e-mail.'; return;}
      users.push({nome,email,tipo,created:new Date().toISOString()});
      saveUsers(users);
      this.reset();
      msgEl.style.color='green'; msgEl.textContent='Cadastro realizado com sucesso!';
    });
  }

  // login
  const loginBtn = qs('#btnLogin');
  if(loginBtn){
    loginBtn.addEventListener('click', function(){
      const email = qs('#loginEmail').value.trim();
      const users = getUsers();
      const u = users.find(x=>x.email===email);
      const msg = qs('#msgLogin');
      if(!u){ msg.style.color='red'; msg.textContent='Usuário não encontrado.'; return; }
      msg.style.color='green'; msg.textContent='Bem-vindo, '+u.nome+'!';
      // redirect based on tipo
      setTimeout(()=> {
        if(u.tipo==='administrador') location.href='dashboard-admin.html';
        else if(u.tipo==='voluntario') location.href='dashboard-voluntario.html';
        else location.href='dashboard-doador.html';
      },900);
    });
  }

  // faleconosco simulation
  const faleForm = qs('#formFale');
  if(faleForm){
    faleForm.addEventListener('submit', function(e){
      e.preventDefault();
      const msg = qs('#msgFale');
      const data = {nome:this.nome.value.trim(), email:this.email.value.trim(), mensagem:this.mensagem.value.trim(), date:new Date().toISOString()};
      if(!data.nome||!data.email||!data.mensagem){ msg.style.color='red'; msg.textContent='Por favor preencha todos os campos.'; return;}
      // store temporary
      const arr = JSON.parse(localStorage.getItem('cv_contacts')||'[]');
      arr.push(data);
      localStorage.setItem('cv_contacts', JSON.stringify(arr));
      this.reset();
      msg.style.color='green'; msg.textContent='Mensagem enviada com sucesso! Entraremos em contato em breve.';
    });
  }

  // Dashboard simulated buttons (common)
  const dashActions = qsa('.action-btn');
  dashActions.forEach(b=>{
    b.addEventListener('click', function(){
      const act = this.getAttribute('data-act');
      const out = qs('#dashMsg');
      if(out){ out.style.color='green'; out.textContent = 'Ação simulada: '+act; setTimeout(()=> out.textContent='',2500); }
      // example: create project simulated
      if(act==='create-project'){
        const projects = JSON.parse(localStorage.getItem('cv_projects')||'[]');
        projects.push({id:'p'+Date.now(),title:'Projeto (simulado) '+(projects.length+1),created:new Date().toISOString()});
        localStorage.setItem('cv_projects', JSON.stringify(projects));
      }
      if(act==='donate'){
        const donations = JSON.parse(localStorage.getItem('cv_donations')||'[]');
        donations.push({id:'d'+Date.now(),amount:50,date:new Date().toISOString()});
        localStorage.setItem('cv_donations', JSON.stringify(donations));
      }
      if(act==='apply-project'){
        const apps = JSON.parse(localStorage.getItem('cv_apps')||'[]');
        apps.push({project:'Projeto Simulado',date:new Date().toISOString()});
        localStorage.setItem('cv_apps', JSON.stringify(apps));
      }
    });
  });

})();
