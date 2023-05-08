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

export async function getStaticPaths(){
    const videosDir = path.join(process.cwd(), 'videos');
    const filenames = fs.readdirSync(videosDir);

    const path = filenames.map((filename)=> {
        const slug = filename.replace(/\.mdx$/,'')
       
        return{
           params: slug,
        };
    });
}
export async function getStaticProps({params}){
  const {slug}=params;
  
  const filesPath = path.join(process.cwd(), 'videos',`${slug}.mdx`)
  const fileContent = fs.readFileSync(filesPath,'utf-8')
  const {content, data} = matter(fileContent);
  const mdxSource =serialize(content);
  
  
    return{
        props: {
            videos:{
                content: mdxSource,
                data,
                slug
            },
        },
    };
};
