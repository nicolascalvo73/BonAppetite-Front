import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { styled } from 'styled-components'
import { menu } from '../../assets/mockedMenu'
import { CTAsContainer } from '../../components/CTAs/CTAsContainer'
import { Dropdown } from '../../components/Dropdown/StyledDropdown'
import { StyledInput } from '../../components/Input/StyledInput'
import { openUploadWidget } from '../../utils/uploadWidget'
import { CircleButton } from '../../components/CircleButton/CircleButton'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { upload } from '../../utils/uploadImg'

const families = menu.map((i) => i.familyName)
const dishes = menu.flatMap((family) => family.recipes)

export const ArticleEdit = () => {
	const imagePlaceholder = 'https://uning.es/wp-content/uploads/2016/08/ef3-placeholder-image.jpg'
	const { id } = useParams()
	const fileInputRef = useRef(null)

	const [articleDetails, setArticleDetails] = useState({
		img: '',
		familyName: '',
		name: '',
		desc: '',
		price: 0,
		time: 0,
	})

	useEffect(() => {
		const selectedMenu = dishes.find((item) => item.id === Number(id))
		if (selectedMenu) {
			const selectedFamily = menu.find((family) => family.recipes.some((recipe) => recipe.id === Number(id)))

			setArticleDetails({
				img: selectedMenu.image,
				familyName: selectedFamily.familyName,
				name: selectedMenu.name,
				desc: selectedMenu.desc,
				price: selectedMenu.price,
				time: selectedMenu.time,
			})
		} else {
			console.error('Como e posible ete susesooo...')
		}
	}, [id])

	const { img, name, desc, price, time, familyName } = articleDetails

	const handleChange = (e) => {
		const { name, value } = e.target
		setArticleDetails((prevArticleDetails) => ({
			...prevArticleDetails,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (
			!articleDetails.familyName ||
			!articleDetails.name ||
			!articleDetails.desc ||
			!articleDetails.price ||
			!articleDetails.time
		) {
			alert('Por favor, completa todos los campos.')
			return
		}
	}

	const handleButtonClick = () => {
		fileInputRef.current.click()
		console.log(articleDetails)
	}

	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0]
		if (selectedFile) {
			try {
				const uploadedImage = await upload(selectedFile)
				await setArticleDetails({
					...articleDetails,
					img: uploadedImage,
				})
				console.log(uploadedImage)
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<StyledView>
			<StyledForm onSubmit={handleSubmit}>
				<HiddenInput type={'file'} accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
				<ButtonContainer>
					<CircleButton onClick={handleButtonClick} className={`big`} type={'file'} icon={faEdit} />
				</ButtonContainer>
				<StyledImg src={img || imagePlaceholder} onClick={openUploadWidget} />

				<Dropdown
					name="familyName"
					label={'Familia'}
					array={families}
					id={'family'}
					value={familyName}
					selectedValue={familyName}
					onChange={handleChange}
					helper={'Selecciona la familia a la que pertenece.'}
				/>

				<StyledInput
					type={'text'}
					name={'name'}
					label={'Nombre'}
					value={name}
					onChange={handleChange}
					helper={'Hasta 20 caracteres'}
				/>
				<StyledInput
					type={'text'}
					name={'desc'}
					label={'Descripción'}
					value={desc}
					onChange={handleChange}
					helper={'Hasta 100 caracteres'}
				/>
				<StyledInput type={'number'} name={'price'} label={'Precio'} value={price} onChange={handleChange} />
				<StyledInput
					type={'number'}
					name={'time'}
					label={'Tiempo de preparación'}
					value={time}
					onChange={handleChange}
					helper={'Tiempo en minutos'}
				/>
				<CTAsContainer type="submit" text1={`Guardar cambios`} />
			</StyledForm>
		</StyledView>
	)
}

const StyledView = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin: auto;
	overflow-y: auto;
	padding: 3vh 4vw 15vh;
	box-sizing: border-box;
	transition: width 0.3s ease-in-out;
	overflow: visible;

	@media (min-width: 650px) {
		width: 30rem;
		padding: 15vh 0;
	}
`

const ButtonContainer = styled.div`
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 15rem;
	opacity: 0.8;
`

const HiddenInput = styled.input`
	display: none;
`

const StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: start;
	width: 100%;
	box-sizing: border-box;
	gap: 2.5rem;
`

const StyledImg = styled.img`
	opacity: 0.7;
	z-index: 1;
	height: 15rem;
	width: 100%;
	border-radius: 0.5rem;
	object-fit: cover;
	box-sizing: border-box;
	transition: all 0.3s ease-in-out;
`
