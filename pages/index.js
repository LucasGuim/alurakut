import React, { Fragment, useEffect, useState } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import axios from 'axios';

function ProfileSidebar(propriedades) {
	return (
		<Box as="aside">
			<img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
			<hr />

			<p>
				<a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
					@{propriedades.githubUser}
				</a>
			</p>
			<hr />

			<AlurakutProfileSidebarMenuDefault />
		</Box>
	);
}

const ProfileRelationsBox = (props) => {
	return (
		<ProfileRelationsBoxWrapper>
			<h2 className="smallTitle">
				{props.title}({props.itens.length})
			</h2>

			<ul>
				{props.itens.map(({login}) => {
      return (
        <li key={login}>
          <a href={`https://github.com/${login}`}>
            <img src={`https://github.com/${login}.png`} />
            <span>{login}</span>
          </a>
        </li>
      )
    })}
			</ul>
		</ProfileRelationsBoxWrapper>
	);
};

export default function Home() {
  
	const usuarioDono = 'LucasGuim';
	const [ comunidades, setComunidades ] = useState([
		{
			id: '12802378123789378912789789123896123',
			title: 'Eu odeio acordar cedo',
			image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
		},
		{
			id: '2802378123789378912789789123896124',
			title: 'Sou legal, n to te dando mole',
			image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0kFWgRbWY867IkLEHpbjqtsLMo0ReoD0Rg&usqp=CAU'
		}
	]);
	// const comunidades = comunidades[0];
	// const alteradorDeComunidades/setComunidades = comunidades[1];

	console.log('Nosso teste');
	// const comunidades = ['Alurakut'];
	const pessoasFavoritas = [
		'MikeOfic96',
		'suellen-oliveira1',
		'romulorvs',
		'rafael-mfer',
		'caioalsoares',
		'lpolon',
		'thainagx',
		'CleuJunior'
	];

	useEffect(() => {
		fetch('https://api.github.com/users/peas/followers')
			.then(function(respostaServidor) {
				return respostaServidor.json();
			})
			.then(function(respostaCompleta) {
				setSeguidores(respostaCompleta);
			});console.log(seguidores)
	}, []);

	const [seguidores,setSeguidores] =useState([]) 

	return (
		<Fragment>
			<AlurakutMenu />
			<MainGrid>
				{/* <Box style="grid-area: profileArea;"> */}
				<div className="profileArea" style={{ gridArea: 'profileArea' }}>
					<ProfileSidebar githubUser={usuarioDono} />
				</div>
				<div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
					<Box>
						<h1 className="title">Bem vindo(a)</h1>

						<OrkutNostalgicIconSet />
					</Box>

					<Box>
						<h2 className="subTitle">O que você deseja fazer?</h2>
						<form
							onSubmit={function handleCriaComunidade(e) {
								e.preventDefault();
								const dadosDoForm = new FormData(e.target);

								console.log('Campo: ', dadosDoForm.get('title'));
								console.log('Campo: ', dadosDoForm.get('image'));

								const comunidade = {
									id: new Date().toISOString(),
									title: dadosDoForm.get('title'),
									image: dadosDoForm.get('image')
								};
								const comunidadesAtualizadas = [ ...comunidades, comunidade ];
								setComunidades(comunidadesAtualizadas);
							}}
						>
							<div>
								<input
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
								/>
							</div>
							<div>
								<input
									placeholder="Coloque uma URL para usarmos de capa"
									name="image"
									aria-label="Coloque uma URL para usarmos de capa"
								/>
							</div>

							<button>Criar comunidade</button>
						</form>
					</Box>
				</div>
				<div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
						<ul>
							{comunidades.map((itemAtual) => {
								return (
									<li key={itemAtual.id}>
										<a href={`/users/${itemAtual.title}`}>
											<img src={itemAtual.image} />
											<span>{itemAtual.title}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Pessoas da comunidade ({pessoasFavoritas.length})</h2>

						<ul>
							{pessoasFavoritas.map((itemAtual) => {
								return (
									<li key={itemAtual}>
										<a href={`/users/${itemAtual}`}>
											<img src={`https://github.com/${itemAtual}.png`} />
											<span>{itemAtual}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBox title="Seguidores" itens={seguidores} />
				</div>
			</MainGrid>
		</Fragment>
	);
}
