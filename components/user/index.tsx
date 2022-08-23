import Link from "next/link";

export const User = ({resource}) => {
    const user = resource.read()

    return <Link href={`mailto:${user.email}`}><a>{user.name}</a></Link>
}