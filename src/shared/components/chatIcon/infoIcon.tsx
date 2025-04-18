import { TextIcon } from './styles'


export default function infoIcon() {
    return(
        <TextIcon>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                 <path d="M12 3A9 9 0 1 0 12 21A9 9 0 1 0 12 3Z" opacity=".3"/>
                 <path d="M13,17h-2v-6h2V17z M13,9h-2V7h2V9z"/>
                 <path fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" 
                 d="M12 3A9 9 0 1 0 12 21A9 9 0 1 0 12 3Z"/>
             </svg>
        </TextIcon>
        
    )
}
