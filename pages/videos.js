import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'
import {MDXRemote} from 'next-mdx-remote'
import {serialize} from 'next-mdx-remote/serialize'
import ReactPlayer from 'react-player'


export default function VideosPage ({ videos }){
    return(
        <div>
            {videos.map((videos)=> (
                <div key={video.slug}>
                    <h2>{video.data.title}</h2>
                    <ReactPlayer url= {`/videos/${videos.slug}`}/>
                    <MDXRemote {...video.content}/>
                </div>
            ))}
        </div>
    );
}
export async function getStaticProps(){
    const videosDir = path.join(process.cwd(), 'videos');
    const filenames = fs.readdirSync(videosDir);
    const videos = filenames.map((filename)=> {
        const filesPath = path.join(videosDir,filename)
        const fileContent = fs.readFileSync(filesPath,'utf-8')
        const {content, data} = matter(fileContent);
        const mdxSource =serialize(content);
        const slug = filename.replace(/\.mdx$/,'')

        return{
            content: mdxSource,
            data,
            slug,
        };
    });
    return{
        props: {videos},
    };
}