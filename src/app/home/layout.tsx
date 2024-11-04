
interface Props {
    children: React.ReactNode;
}

export default async function MainLayout(props: Props){

    return (
        <div className="h-full w-full">
            {props.children}
        </div>
    )
}