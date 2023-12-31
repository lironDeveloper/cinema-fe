import { CSSProperties, FC } from 'react';
import { useDropzone } from 'react-dropzone';


const dropzoneStyles: CSSProperties = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '16px'
};

const thumbsContainer: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
};

const thumb: CSSProperties = {
    display: 'inline-flex',
    width: 'auto',
    height: 212,
    boxSizing: 'border-box'
};

const img: CSSProperties = {
    display: 'block',
    width: 'auto',
    height: '100%',
    borderRadius: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
};

interface Props {
    image: string;
    onImageUpload: (objectURL: string) => void;
}

const ThumbnailUploader: FC<Props> = (props) => {
    const { image, onImageUpload } = props;

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
        maxFiles: 1,
        onDrop: (acceptedFiles: File[]) => {
            const imageBlob: File = acceptedFiles[0];
            onImageUpload(URL.createObjectURL(imageBlob));
        },
    });


    return (
        <section style={dropzoneStyles}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p style={{ color: '#a6a6a6' }}>גרור ושחרר או לחץ ובחר תמונת נושא עבור הסרט</p>
            </div>
            {image && <aside style={thumbsContainer}>
                <div style={thumb}>
                    <img
                        src={image}
                        style={img}
                    />
                </div>
            </aside>}
        </section>
    );
};

export default ThumbnailUploader;
