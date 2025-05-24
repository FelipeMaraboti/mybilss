import React from "react";
import { useState, useEffect } from "react";
import Modal from "./components/Modal";

function App() {
	const [transacoes, setTransacoes] = useState([]);

	const [modalAberto, setModalAberto] = useState(false);

	const [totalEmConta, setTotalEmConta] = useState(0);
	const [totalInvestido, setTotalInvestido] = useState(0);
	const [totalGasto, setTotalGasto] = useState(0);

	const [data, setData] = useState("");
	const [descricao, setDescricao] = useState("");
	const [valor, setValor] = useState("");
	const [tipo, setTipo] = useState("Entrada");

	// Função para salvar no localStorage com tratamento de err

	useEffect(() => {
    const carregarDoLocalStorage = () => {
      try {
        if (typeof Storage !== "undefined") {
          const dados = localStorage.getItem("transacoes");
          return dados ? JSON.parse(dados) : [];
        }
      } catch (error) {
        console.warn("Erro ao carregar do localStorage:", error);
      }
      return [];
    }
    const dadosCarregados = carregarDoLocalStorage();
    setTransacoes(dadosCarregados)
  },[]);

	useEffect(() => {
		const atualizarTotalEmConta = (transacoes) => {
			const total = transacoes.reduce((totalEmConta, transacao) => {
				if (transacao.tipo === "Entrada") return totalEmConta + transacao.valor;
				if (transacao.tipo === "Saída") return totalEmConta - transacao.valor;
				if (transacao.tipo === "Investimento")
					return totalEmConta - transacao.valor;
				if (transacao.tipo === "Retirada Investimento")
					return totalEmConta + transacao.valor;
				return totalEmConta;
			}, 0);
			setTotalEmConta(total);
		};
		atualizarTotalEmConta(transacoes);
	}, [transacoes]);

	useEffect(() => {
		const atualizarTotalEmInvestimento = (transacoes) => {
			const total = transacoes.reduce((totalInvestido, transacao) => {
				if (transacao.tipo === "Retirada Investimento")
					return totalInvestido - transacao.valor;
				if (transacao.tipo === "Investimento")
					return totalInvestido + transacao.valor;
				return totalInvestido;
			}, 0);
			setTotalInvestido(total);
		};
		atualizarTotalEmInvestimento(transacoes);
	}, [transacoes]);

	useEffect(() => {
		const atualizarTotalEmGasto = (transacoes) => {
			const total = transacoes.reduce((totalGasto, transacao) => {
				if (transacao.tipo === "Saída") return totalGasto + transacao.valor;
				return totalGasto;
			}, 0);
			setTotalGasto(total);
		};
		atualizarTotalEmGasto(transacoes);
	}, [transacoes]);

  const salvarNoLocalStorage = (dados) => {
		try {
			if (typeof Storage !== "undefined") {
				localStorage.setItem("transacoes", JSON.stringify(dados));
			}
		} catch (error) {
			console.warn("Erro ao salvar no localStorage:", error);
		}
	};

	const formatarData = (valor) => {
		const somenteNumeros = valor.replace(/\D/g, "");

		let formatado = somenteNumeros;

		if (formatado.length >= 3 && formatado.length <= 4) {
			formatado = formatado.replace(/(\d{2})(\d+)/, "$1/$2");
		} else if (formatado.length >= 5) {
			formatado = formatado.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
		}

		return formatado.slice(0, 10);
	};

	const onHandleAdicionarTransacao = () => {
		const novaTransacao = {
			id: new Date().getTime(),
			data: data,
			descricao: descricao,
			valor: Number.parseFloat(valor),
			tipo: tipo,
		};

		setTransacoes((prev) => [...prev, novaTransacao]);

		setData("");
		setDescricao("");
		setValor("");
		setTipo("Entrada");

    salvarNoLocalStorage([...transacoes, novaTransacao]);
		setModalAberto(false);
	};

	const getTipoEstiloTabela = (tipo) => {
		switch (tipo) {
			case "Entrada":
				return "bg-emerald-500";
			case "Saída":
				return "bg-red-500";
			case "Investimento":
				return "bg-blue-500";
			case "Retirada Investimento":
				return "bg-orange-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<>
			<header className="w-screen h-[4rem] flex items-center">
				<nav className="w-full flex justify-center">
					<h1 className="text-3xl text-gray-700 font-bold font-mono">
						MyBilss.com
					</h1>
				</nav>
			</header>
			<main className="w-screen p-5 md:p-2">
				<section className="w-full mt-[2rem] flex flex-col md:flex-row items-center gap-[1rem] md:gap-[3rem] justify-center">
					<div className="h-[8rem] w-[16rem] bg-gray-900 flex flex-col gap-[1rem] items-center justify-center rounded-md">
						<h2
							className={`text-3xl text-center font-bold ${totalEmConta > 0 ? "text-emerald-400" : "text-red-400"}`}
						>
							{Intl.NumberFormat("pt-br", {
								style: "currency",
								currency: "BRL",
							}).format(totalEmConta)}
						</h2>
						<p className="text-center font-bold text-gray-200">
							Saldo em conta
						</p>
					</div>

					<div className="h-[8rem] w-[16rem] bg-gray-900 flex flex-col gap-[1rem] items-center justify-center rounded-md">
						<h2 className="text-3xl text-center font-bold text-emerald-400">
							{Intl.NumberFormat("pt-br", {
								style: "currency",
								currency: "BRL",
							}).format(totalInvestido)}
						</h2>
						<p className="text-center font-bold text-gray-200">
							Total investido
						</p>
					</div>

					<div className="h-[8rem] w-[16rem] bg-gray-900 flex flex-col gap-[1rem] items-center justify-center rounded-md">
						<h2 className="text-3xl text-center font-bold text-red-400">
							{Intl.NumberFormat("pt-br", {
								style: "currency",
								currency: "BRL",
							}).format(totalGasto)}
						</h2>
						<p className="text-center font-bold text-gray-200">
							Total de gastos do mês
						</p>
					</div>
				</section>
				<section className="w-full mt-[2rem] flex justify-center">
					<div className="w-[54rem] flex justify-end">
						<button
							type="button"
							onClick={() => setModalAberto(true)}
							className="px-4 py-2 bg-gray-900 text-sm text-white rounded-md hover:bg-gray-800 transition duration-200 cursor-pointer"
						>
							+ Adicionar transação
						</button>

						<Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
							<div>
								<h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
									Adicionar Transação
								</h2>
								<form className="flex flex-col gap-4 mb-4">
									<label className="flex flex-col">
										<span className="text-gray-900 pl-1 text-[12px] md:text-md">Data :</span>
										<input
											required
											value={data}
											onChange={(e) => setData(formatarData(e.target.value))}
											type="text"
											placeholder="Ex: 10/02/2025..."
											className="px-1 py-2 border-2 border-gray-400 focus:border-gray-900 rounded-md"
										/>
									</label>
									<label className="flex flex-col">
										<span className="text-gray-900 pl-1 text-[12px] md:text-md">Descrição:</span>
										<input
											required
											value={descricao}
											onChange={(e) => setDescricao(e.target.value)}
											type="text"
											placeholder="Ex: Pagamento do aluguel do kitnet..."
											className="px-1 py-2 border-2 border-gray-400 focus:border-gray-900 rounded-md"
										/>
									</label>
									<label className="flex flex-col">
										<span className="text-gray-900 pl-1 text-[12px] md:text-md ">Valor :</span>
										<input
											required
											value={valor}
											onChange={(e) => setValor(e.target.value)}
											type="text"
											placeholder="Ex: 973.45..."
											className="md:px-1 py-2 border-2 border-gray-400 focus:border-gray-900 rounded-md"
										/>
									</label>
									<label className="flex flex-col">
										<span className="text-gray-900 text-[12px] md:text-md pl-1">Tipo :</span>
										<select
											required
											value={tipo}
											onChange={(e) => setTipo(e.target.value)}
											className="px-1 py-2 border-2 border-gray-400 focus:border-gray-900 rounded-md"
										>
											<option value="Entrada">Entrada</option>
											<option value="Saída">Saída</option>
											<option value="Investimento">Investimento</option>
											<option value="Retirada Investimento">
												Retirada Investimento
											</option>
										</select>
									</label>
								</form>
							</div>
							<div className="w-full flex justify-center items-center gap-2">
								<button
									type="button"
									onClick={() => setModalAberto(false)}
									className="flex-1 px-4 py-2 bg-red-500 text-[10px] md:text-sm text-white rounded-md hover:bg-red-600 transition duration-200 cursor-pointer"
								>
									Cancelar
								</button>
								<button
									type="button"
									onClick={onHandleAdicionarTransacao}
									className="flex-1 px-4 py-2 bg-gray-900 text-[10px] md:text-sm text-white rounded-md hover:bg-gray-800 transition duration-200 cursor-pointer"
								>
									Cadastrar Transação
								</button>
							</div>
						</Modal>
					</div>
				</section>
				<section className="w-full mt-2 flex justify-center">
					<div className="w-full max-w-[54rem] rounded-xl border border-gray-900 shadow-sm overflow-hidden">
						<table className="w-full table-auto">
							<thead className="bg-gray-900">
								<tr className="text-left text-gray-100 font-semibold text-sm">
									<th className="px-1 md:px-4 py-3 w-[8rem] md:w-[8rem]">Data</th>
									<th className="px-1 md:px-4 py-3 w-[14rem] md:w-[28rem]">Descrição</th>
									<th className="px-1 md:px-4 py-3 w-[5rem] md:w-[10rem]">Valor</th>
									<th className="px-1 md:px-4 py-3 w-[4rem] md:w-[8rem]">Tipo</th>
								</tr>
							</thead>
							{transacoes.length > 0 ? (
								<tbody>
									{transacoes.map((transferencia) => (
										<tr
											key={transferencia.id}
											className="text-[8px] md:text-[14px] border-t border-gray-200 hover:bg-gray-50 transition"
										>
											<td className="px-4 py-2 text-gray-900">
												{transferencia.data}
											</td>
											<td className="px-4 py-2 text-gray-900">
												{transferencia.descricao}
											</td>
											<td className="px-4 py-2 ">
												{Intl.NumberFormat("pt-br", {
													style: "currency",
													currency: "BRL",
												}).format(transferencia.valor)}
											</td>
											<td className="px-4 py-2">
												<span
													className={`inline-block px-2 py-1 md:text-xs md:font-medium rounded-md text-white ${getTipoEstiloTabela(transferencia.tipo)}`}
												>
													{transferencia.tipo}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							) : (
								<tbody>
									<tr>
										<td
											colSpan="4"
											className="px-4 py-2 text-center text-gray-500"
										>
											Nenhuma transação cadastrada.
										</td>
									</tr>
								</tbody>
							)}
						</table>
					</div>
				</section>
			</main>
		</>
	);
}

export default App;
