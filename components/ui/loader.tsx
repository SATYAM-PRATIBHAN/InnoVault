import { DNA } from "react-loader-spinner";

export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <DNA
                visible={true}
                height="100"
                width="100"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    );
}