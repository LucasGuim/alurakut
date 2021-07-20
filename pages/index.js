import React, { Fragment, useEffect, useState } from 'react';
import nookies from  'nookies'
import jwt from 'jsonwebtoken'
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
				{props.itens.map(({ login }) => {
					return (
						<li key={login}>
							<a href={`https://github.com/${login}`}>
								<img src={`https://github.com/${login}.png`} />
								<span>{login}</span>
							</a>
						</li>
					);
				})}
			</ul>
		</ProfileRelationsBoxWrapper>
	);
};

export default function Home(props) {
	const usuarioDono = props.githubUser;
	const [ comunidades, setComunidades ] = useState([]);
	
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
		fetch(`https://api.github.com/users/${usuarioDono}/followers`)
			.then(function(respostaServidor) {
				return respostaServidor.json();
			})
			.then(function(respostaCompleta) {
				setSeguidores(respostaCompleta);
			});
		fetch('https://graphql.datocms.com/', {
			method: 'POST',
			headers: {
				Authorization: '8915253be29f3d8ad1fa37fa21423a',
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				query: `query {
				  allCommunities {
					id 
					title
					imageUrl
					creatorSlug
				  }
				}`
			})
		})
			.then((response) => response.json())
			.then((respostaComp) => {
				const comunidadesVindasDoDato = respostaComp.data.allCommunities;
				console.log(comunidadesVindasDoDato);
				setComunidades(comunidadesVindasDoDato);
			});
	}, []);

	const [ seguidores, setSeguidores ] = useState([]);

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
									title: dadosDoForm.get('title'),
									imageUrl: dadosDoForm.get('image'),
									creatorSlug: usuarioDono
								};
								fetch('/api/comunidades', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(comunidade)
								}).then(async (response) => {
									const dados = await response.json();
									console.log(dados.registroCriado);
									const comunidade = dados.registroCriado;
									const comunidadesAtualizadas = [ ...comunidades, comunidade ];
									setComunidades(comunidadesAtualizadas);
								});
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
										<a href={`/users/${itemAtual.id}`}>
											<img src={itemAtual.imageUrl} />
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

export async function getServerSideProps(context){
	// const cookies = nookies.get(context)
	// const token = cookies.USER_TOKEN
	// const githubUser =  jwt.decode(token).githubUser;
	
	// if (!githubUser) {
	// 	return {
	// 	  redirect: {
	// 		destination: '/login',
	// 		permanent: false,
	// 	  },
	// 	}
	 // }	
	return {
		props : {
			githubUser: 'LucasGuim'
		}
	}
}