import { makeStyles, Skeleton, SkeletonItem, tokens } from "@fluentui/react-components"

const useStyles = makeStyles({
  invertedWrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  firstRow: {
    alignItems: "center",
    display: "flex",
    paddingBottom: "10px",
    position: "relative",
    gap: "10px",
  },
  secondThirdRow: {
    alignItems: "center",
    display: "flex",
    paddingBottom: "10px",
    position: "relative",
    gap: "10px",
  },
});

const SkeletonPage = () => {
    const styles = useStyles();
    return (
        <div className="p-5">
        <div className={styles.invertedWrapper}>
            <Skeleton size={20} aria-label="Loading Content">
                <div className={styles.firstRow}>
                    <SkeletonItem shape="circle" size={48} />
                    <SkeletonItem shape="rectangle" size={48} />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="circle" size={24} />
                    <SkeletonItem />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="square" size={24} />
                    <SkeletonItem />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="square" size={56}/>
                    <SkeletonItem size={56}/>
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem size={56}/>
                    <SkeletonItem shape="circle" size={56}/>
                </div>
            </Skeleton>
        </div>
        </div>
    )
}

export default SkeletonPage