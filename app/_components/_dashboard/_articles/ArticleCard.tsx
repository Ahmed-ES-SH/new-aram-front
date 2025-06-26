import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import React from "react";
import Img from "../../Img";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineTitle } from "react-icons/md";
import { FaComments } from "react-icons/fa";
import { VscReactions } from "react-icons/vsc";
import { formatDate } from "@/app/_helpers/dateHelper";
import Link from "next/link";

interface props {
  Article: ArticleType;
  direct: string;
}

export default function ArticleCard({ Article, direct }: props) {
  const date = formatDate(Article.created_at);
  return (
    <Link className="block w-full" href={`${direct}/${Article.id}`}>
      <div className=" group w-[97%] max-xl:w-full h-[300px] max-md:h-[500px] max-lg:h-[480px] max-xl:h-[450px] overflow-hidden rounded-md hover:scale-110 hover:bg-primary hover:text-white duration-200 cursor-pointer shadow-lg bg-white border border-gray-300 flex gap-2 items-start max-xl:flex-col">
        <div className="img flex-1/5 max-xl:h-1/2 h-full  max-xl:w-full">
          <Img
            className="w-full h-full object-cover"
            src={Article.image ? Article.image : "/assorted-mixed-fruits.jpg"}
          />
        </div>
        <div className="content p-2 flex-1  max-xl:h-1/2 h-full  max-xl:w-full">
          <div className="flex flex-col justify-between items-start w-full h-full pb-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <CiCalendarDate className="size-6 max-xl:size-6 text-primary group-hover:text-primary_dash" />
                <span className="text-[14px]">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineTitle className="size-6 max-xl:size-6 text-primary group-hover:text-primary_dash" />
                <h1>
                  {Article.title_en.length > 30
                    ? Article.title_en.slice(0, 30) + "..."
                    : Article.title_en}
                </h1>
              </div>
              <p className="text-[15px] text-gray-500 group-hover:text-white">
                {Article.content_en.length > 180
                  ? Article.content_en.slice(0, 180) + "..."
                  : Article.content_en}
              </p>
            </div>
            <div className="flex items-center max-md:flex-col max-md:gap-2 w-full px-2 justify-between mt-4">
              <div className="user-info flex items-center gap-2">
                <Img
                  src={
                    Article.author.image
                      ? Article.author.image
                      : "/defaults/default-male.png"
                  }
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-[14px]">{Article.author.name}</p>
              </div>
              <div className="article-numbers">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaComments className="size-4 text-green-400 group-hover:text-primary_dash" />
                    <p className="text-[14px]">
                      {Article.comments_count ? Article.comments_count : 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <VscReactions className="size-4 text-red-400 group-hover:text-primary_dash" />
                      <p className="text-[14px]">
                        {Article.interactions && Article.interactions.length > 0
                          ? Article.interactions[0].totalReactions
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
